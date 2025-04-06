import React, { useState, useEffect, } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../Context/Auth';
import { useNotifications } from '../../Services/useNotification';
import { NotificationService } from '../../Services/NotificationService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../Redux/Actions/orderActions';
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

const Notification = () => {
  const navigation = useNavigation();
  const { user, token } = useAuth();
  const { expoPushToken, notification, tokenStatus, resendToken } = useNotifications();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const getIdFromMessage = (message, type) => {
    if (type === 'order') {
      const orderPattern = /(?:order\s*#|#)(\w+)/i;
      const match = message.match(orderPattern);
      return match ? match[1] : null;
    } else if (type === 'promo') {
      const promoPattern = /(?:product\s*#|#)(\w+)/i;
      const match = message.match(promoPattern);
      return match ? match[1] : null;
    }
    return null;
  };

  const fetchNotifications = async () => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await NotificationService.getUserNotifications(token);

      if (response.data && response.data.length > 0) {
        setNotifications(response.data);
      }

      // Also fetch unread count
      fetchUnreadCount();
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!token) return;

    try {
      const response = await NotificationService.getUnreadCount(token);
      if (response.data && response.data.unreadCount !== undefined) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  useEffect(() => {
    if (notification) {
      // When a new notification is received, refresh the list
      fetchNotifications();
    }
  }, [notification]);

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // difference in seconds

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

      return date.toLocaleDateString();
    } catch (e) {
      return 'Unknown time';
    }
  };

  const markAsRead = async (id) => {
    try {
      // Optimistically update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(item =>
          item._id === id ? { ...item, read: true } : item
        )
      );

      // Make API call to mark as read on server
      if (token) {
        await NotificationService.markAsRead(id, token);
        // Update unread count
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Revert UI change on error
      setNotifications(prevNotifications =>
        prevNotifications.map(item =>
          item._id === id && item.read === true ? { ...item, read: false } : item
        )
      );
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!token || notifications.length === 0) return;

    try {
      // Optimistically update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(item => ({ ...item, read: true }))
      );

      // Make API call
      await NotificationService.markAllAsRead(token);

      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      // Revert by re-fetching
      fetchNotifications();
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      // Optimistically update UI
      setNotifications(prevNotifications =>
        prevNotifications.filter(item => item._id !== id)
      );

      // Make API call
      if (token) {
        await NotificationService.deleteNotification(id, token);
        // Update unread count if needed
        fetchUnreadCount();
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      // Revert UI change on error by re-fetching all notifications
      fetchNotifications();
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const checkTokenStatus = () => {
    if (tokenStatus.error) {
      Alert.alert(
        'Notification Token Status',
        `Error: ${tokenStatus.error}. Would you like to try again?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: resendToken }
        ]
      );
    } else if (tokenStatus.registered) {
      Alert.alert('Notification Token Status', 'You are successfully registered for push notifications.');
    } else {
      Alert.alert('Notification Token Status', 'Not registered for push notifications yet.');
    }
  };
  const navigateToTrackOrder = async (item) => {
    if (item.type === 'order') {
      let orderId = item.orderId || getIdFromMessage(item.message, 'order');

      if (orderId) {
        try {
          setLoading(true);

          // Now this will return the orders data
          const orders = await dispatch(fetchOrders(token));

          // Find the specific order
          const orderData = orders.find(order => order._id === orderId);

          if (orderData) {
            // Navigate with the fresh order data
            navigation.navigate('TrackOrder', {
              orderId: orderId,
              order: orderData
            });
          } else {
            // If order not found in response, navigate with minimal info
            navigation.navigate('TrackOrder', {
              orderId: orderId,
              order: item.orderData || { _id: orderId }
            });

            Alert.alert('Warning', 'Could not retrieve latest order status. Please refresh the screen.');
          }
        } catch (err) {
          // Error handling
          console.error('Error navigating to order:', err);
          Alert.alert('Error', 'Failed to load order details.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const navigateToPromotion = async (item) => {
    if (item.type !== 'promo') return;

    try {
      setLoading(true);

      console.log('Notification item:', JSON.stringify(item, null, 2));

      const productId = item.data?.productId ||
        item.productId ||
        getIdFromMessage(item.message, 'promo');

      if (!productId) {
        Alert.alert('Error', 'No product ID found in notification');
        return;
      }

      const response = await axios.get(`${baseURL}/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (response.data?.product) {
        navigation.navigate('SingleProduct', {
          item: response.data.product
        });
      } else {

        navigation.navigate('SingleProduct', {
          productId: productId,
          item: { _id: productId }
        });
        Alert.alert('Warning', 'Could not retrieve full product details');
      }
    } catch (err) {
      console.error('Product fetch error:', err.response?.data || err.message);


      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showNotificationOptions = (item) => {
    const options = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: item.read ? 'Mark as Unread' : 'Mark as Read',
        onPress: () => markAsRead(item._id)
      },
      {
        text: 'Delete',
        onPress: () => deleteNotification(item._id),
        style: 'destructive'
      }
    ];

    // Add navigation options based on notification type
    if (item.type === 'order') {
      options.splice(1, 0, {
        text: 'Track Order',
        onPress: () => navigateToTrackOrder(item)
      });
    } else if (item.type === 'promo') {
      options.splice(1, 0, {
        text: 'View Product',
        onPress: () => navigateToPromotion(item)
      });
    }

    Alert.alert(
      'Notification Options',
      `What would you like to do with "${item.title}"?`,
      options
    );
  };

  const getIconName = (type) => {
    switch (type) {
      case 'order':
        return 'cube-outline';
      case 'promo':
        return 'pricetag-outline';
      case 'payment':
        return 'card-outline';
      case 'feedback':
        return 'star-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'order':
        return '#4caf50';
      case 'promo':
        return '#ff9800';
      case 'payment':
        return '#2196f3';
      case 'feedback':
        return '#9c27b0';
      default:
        return '#607d8b';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => {
        markAsRead(item._id);
        if (item.type === 'order') {
          navigateToTrackOrder(item);
        } else if (item.type === 'promo') {
          navigateToPromotion(item);
        }
      }}
      onLongPress={() => showNotificationOptions(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor(item.type) + '20' }]}>
        <Icon name={getIconName(item.type)} size={24} color={getIconColor(item.type)} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderErrorMessage = () => (
    <View style={styles.errorContainer}>
      <Icon name="alert-circle-outline" size={50} color="#ff6b6b" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
        </Text>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
              <Icon name="checkmark-done-outline" size={20} color="#2196f3" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={checkTokenStatus}>
            <Icon name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196f3" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : error && notifications.length === 0 ? (
        renderErrorMessage()
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196f3']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubText}>
            You don't have any notifications at the moment
          </Text>
        </View>
      )}

      {/* Push Notification Status Indicator */}
      {tokenStatus.error && (
        <TouchableOpacity
          style={styles.notificationStatusBadge}
          onPress={resendToken}
        >
          <Icon name="warning-outline" size={16} color="#fff" />
          <Text style={styles.notificationStatusText}>Reconnect</Text>
        </TouchableOpacity>
      )}
    </View>
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
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f7ff',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196f3',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  trackButton: {
    backgroundColor: '#4CD964',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  notificationStatusBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  notificationStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  }
});

export default Notification;