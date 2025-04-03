import React, { useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../Redux/Actions/orderActions';
import moment from 'moment';
import { useAuth } from '../../Context/Auth';
import { useFocusEffect } from '@react-navigation/native';

const MyOrder = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const { orders, loading: ordersLoading, error } = useSelector(state => state.orders);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setLoading(true); 
        dispatch(fetchOrders(token))
          .then(() => setLoading(false)) 
          .catch(() => setLoading(false)); 
      }
      return () => {};
    }, [dispatch, token])
  );
  
  const formatDate = (dateString) => {
    return moment(dateString).format('ddd MMMM DD, YYYY');
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderItem}
      onPress={() => navigation.navigate('TrackOrder', { orderId: item._id, order: item })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Order#: {item._id.substring(0, 10)}</Text>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      {/* <View style={styles.orderDetails}>
        {item.totalPrice && (
          <Text style={styles.priceText}>Total: ₱{item.totalPrice.toFixed(2)}</Text>
        )}
      </View> */}
      <TouchableOpacity 
        style={styles.trackButton}
        onPress={() => navigation.navigate('TrackOrder', { orderId: item._id, order: item })}
      >
        <Text style={styles.trackButtonText}>Track Order</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading || ordersLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CD964" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>Error loading orders</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchOrders(token))}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={70} color="#C8C8C8" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubtext}>When you place an order, it will appear here</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#4CD964',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 8,
  },
  shopButton: {
    marginTop: 16,
    backgroundColor: '#4CD964',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderIdText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333',
  },
  dateText: {
    fontSize: 12,
    color: '#777',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  trackButton: {
    backgroundColor: '#4CD964',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  trackButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MyOrder;