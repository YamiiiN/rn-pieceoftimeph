export const FETCH_NOTIFICATIONS_REQUEST = 'FETCH_NOTIFICATIONS_REQUEST';
export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const FETCH_NOTIFICATIONS_FAILURE = 'FETCH_NOTIFICATIONS_FAILURE';
export const SET_UNREAD_COUNT = 'SET_UNREAD_COUNT';
export const MARK_AS_READ = 'MARK_AS_READ';
export const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const INCREMENT_UNREAD_COUNT = 'INCREMENT_UNREAD_COUNT';
export const DECREMENT_UNREAD_COUNT = 'DECREMENT_UNREAD_COUNT';
import { NotificationService } from '../../Services/NotificationService';

export const fetchNotificationsRequest = () => ({
  type: FETCH_NOTIFICATIONS_REQUEST
});

export const fetchNotificationsSuccess = (notifications) => ({
  type: FETCH_NOTIFICATIONS_SUCCESS,
  payload: notifications
});

export const fetchNotificationsFailure = (error) => ({
  type: FETCH_NOTIFICATIONS_FAILURE,
  payload: error
});

export const setUnreadCount = (count) => ({
  type: SET_UNREAD_COUNT,
  payload: count
});

export const markAsReadAction = (notificationId) => ({
  type: MARK_AS_READ,
  payload: notificationId
});

export const markAllAsReadAction = () => ({
  type: MARK_ALL_AS_READ
});

export const deleteNotificationAction = (notificationId) => ({
  type: DELETE_NOTIFICATION,
  payload: notificationId
});

export const addNotificationAction = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification
});

export const incrementUnreadCount = () => ({
  type: INCREMENT_UNREAD_COUNT
});

export const decrementUnreadCount = () => ({
  type: DECREMENT_UNREAD_COUNT
});


export const fetchNotifications = (token) => async (dispatch) => {
  dispatch(fetchNotificationsRequest());
  
  try {
    const response = await NotificationService.getUserNotifications(token);
    dispatch(fetchNotificationsSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message || 'Failed to fetch notifications'));
    throw error;
  }
};

export const fetchUnreadCount = (token) => async (dispatch) => {
  try {
    const response = await NotificationService.getUnreadCount(token);
    if (response && response.data && response.data.unreadCount !== undefined) {
      const count = response.data.unreadCount;
      dispatch(setUnreadCount(count));
      return count;
    }
    return 0; 
  } catch (error) {
    
    console.log('Error fetching unread count, will retry later');
    return 0;  
  }
};

export const markAsRead = (notificationId, token) => async (dispatch) => {
  try {
    await NotificationService.markAsRead(notificationId, token);
    dispatch(markAsReadAction(notificationId));
    dispatch(decrementUnreadCount());
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = (token) => async (dispatch) => {
  try {
    await NotificationService.markAllAsRead(token);
    dispatch(markAllAsReadAction());
    dispatch(setUnreadCount(0));
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = (notificationId, token) => async (dispatch, getState) => {
  try {
    await NotificationService.deleteNotification(notificationId, token);
    
    const state = getState();
    const notification = state.notifications.items.find(item => item._id === notificationId);
    
    dispatch(deleteNotificationAction(notificationId));
    
    if (notification && !notification.read) {
      dispatch(decrementUnreadCount());
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const handleNewNotification = (notification, token) => async (dispatch) => {
  dispatch(addNotificationAction(notification));
  
  if (!notification.read) {
    dispatch(incrementUnreadCount());
  }
  
  // Optionally refresh the full notification list
  // dispatch(fetchNotifications(token));
  
  return notification;
};