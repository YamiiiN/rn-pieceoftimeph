import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../Redux/Actions/orderActions';
import { useAuth } from '../../Context/Auth';

const Orders = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { orders, loading, error } = useSelector(state => state.orders);
  const { token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        dispatch(fetchAllOrders(token));
      }
      return () => { };
    }, [dispatch, token])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    if (token) {
      dispatch(fetchAllOrders(token));
    }
    setRefreshing(false);
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  const renderOrderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item)}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              item.user?.images?.[0]?.url
                ? { uri: item.user.images[0].url }
                : require('../../assets/icon.png')
            }
            style={styles.avatar}
          />
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.customerName}>{item.user?.first_name} {item.user?.last_name}</Text>
          <Text style={styles.orderDate}>Received: {new Date(item.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.orderId}>
            Order ID: {item._id ? item._id.slice(0, -8) : "D34261244667".slice(0, -8)}
          </Text>

        </View>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusButton, getStatusStyle(item.status)]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return styles.statusDelivered;
      case 'out for delivery':
        return styles.statusOutForDelivery;
      case 'processed':
      case 'confirmed':
      case 'dispatched':
        return styles.statusProcessing;
      default:
        return styles.statusPending;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => dispatch(fetchAllOrders(token))}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Text style={styles.backButton}>{'<'}</Text> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id.slice(0, -8).toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
  },
  backButton: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  placeholder: {
    width: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 12,
    color: '#888888',
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  statusDelivered: {
    backgroundColor: '#4CAF50', // Green
  },
  statusOutForDelivery: {
    backgroundColor: '#2196F3', // Blue
  },
  statusProcessing: {
    backgroundColor: '#FF9800', // Orange
  },
  statusPending: {
    backgroundColor: '#9E9E9E', // Gray
  },
  button: {
    backgroundColor: "#6A5ACD",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default Orders;