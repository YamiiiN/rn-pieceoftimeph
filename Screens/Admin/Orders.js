import React, { useCallback, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import ColorStatus from "../Shared/ColorStatus";
import { useAuth } from '../../Context/Auth';
import { fetchAllOrders, updateOrderStatus } from '../../Redux/Actions/orderActions';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(state => state.orders);
  const { token } = useAuth();
  const [statusChange, setStatusChange] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const getAvailableStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return ["Pending", "Dispatched", "Delivered"];
      case "Dispatched":
        return ["Dispatched", "Delivered"];
      case "Delivered":
        return ["Delivered"];
      default:
        return ["Pending", "Dispatched", "Delivered"];
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        dispatch(fetchAllOrders(token));
      }
      return () => {};
    }, [dispatch, token])
  );

  const handleStatusChange = (orderId, status) => {
    setStatusChange({
      ...statusChange,
      [orderId]: status
    });
  };

  const handleUpdateOrder = (orderId) => {
    if (token && statusChange[orderId]) {
      dispatch(updateOrderStatus(orderId, statusChange[orderId], token));
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Order Status Updated",
        text2: "",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (token) {
      dispatch(fetchAllOrders(token));
    }
    setRefreshing(false);
  };

  const getOrderStatusIndicator = (status) => {
    switch (status) {
      case 'Delivered':
        return <ColorStatus available />;
      case 'Dispatched':
        return <ColorStatus limited />;
      case 'Processing':
        return <ColorStatus limited />;
      default:
        return <ColorStatus unavailable />;
    }
  };

  const getCardColor = (status) => {
    switch (status) {
      case 'Delivered':
        return "#2ECC71"; 
      case 'Dispatched':
        return "#F1C40F"; 
      default:
        return "#E74C3C"; 
    }
  };

  const renderOrderItem = ({ item }) => {
    return (
      <View style={[
        styles.orderCard, 
        { backgroundColor: getCardColor(item.status) }
      ]}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>Order #{item._id}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.orderDetails}>
          <Text style={styles.text}>Customer: {item.user?.first_name} {item.user?.last_name}</Text>
          <Text style={styles.text}>Contact: {item.contact_number}</Text>
          <Text style={styles.text}>Address: {item.shipping_address}</Text>
          <Text style={styles.text}>Shipping Method: {item.shipping_method}</Text>
          <Text style={styles.text}>Payment Method: {item.payment_method}</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.text}>Status: {item.status} </Text>
            {getOrderStatusIndicator(item.status)}
          </View>

          <Text style={styles.priceText}>
            Total: ₱{item.totalPrice.toFixed(2)}
          </Text>
          
          <Text style={styles.sectionTitle}>Order Items:</Text>
          {item.order_items.map((orderItem, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.text}>
                {orderItem.product?.name || 'Product'} x{orderItem.quantity}
              </Text>
              <Text style={styles.text}>
                ${orderItem.product?.sell_price * orderItem.quantity}
              </Text>
            </View>
          ))}

          <View style={styles.updateSection}>
            <Text style={styles.label}>Update Status:</Text>
            <Picker
              style={styles.picker}
              selectedValue={statusChange[item._id] || item.status}
              onValueChange={(value) => handleStatusChange(item._id, value)}
            >
              {getAvailableStatuses(item.status).map((status) => (
                <Picker.Item 
                key={status} 
                label={status} 
                value={status} 
                enabled={status !== "Pending" || item.status === "Pending"} // Disable previous statuses
                />
            ))}
            </Picker>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleUpdateOrder(item._id)}
            >
              <Text style={styles.buttonText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F68B1E" />
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
        <Text style={styles.headerTitle}>Admin Order Management</Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 15,
    backgroundColor: "#F68B1E",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    padding: 10,
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
  orderCard: {
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    overflow: "hidden",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  orderDate: {
    fontSize: 14,
    color: "#fff",
  },
  orderDetails: {
    padding: 15,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: "#fff",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#fff",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginVertical: 10,
    color: "#fff",
  },
  updateSection: {
    marginTop: 15,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#F68B1E",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Orders;