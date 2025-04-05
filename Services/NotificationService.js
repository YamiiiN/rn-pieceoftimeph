import axios from "axios";
import baseURL from "../assets/common/baseUrl";

export const NotificationService = {
    registerPushToken: (expoPushToken, authToken) => {
        return axios.post(
            `${baseURL}/notification/register-push-token`,
            { pushToken: expoPushToken },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    getUserNotifications: (authToken) => {
        return axios.get(
            `${baseURL}/notification/user-notifications`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    markAsRead: (notificationId, authToken) => {
        return axios.put(
            `${baseURL}/notification/mark-read/${notificationId}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    markAllAsRead: (authToken) => {
        return axios.put(
            `${baseURL}/notification/mark-all-read`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    deleteNotification: (notificationId, authToken) => {
        return axios.delete(
            `${baseURL}/notification/${notificationId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    getUnreadCount: (authToken) => {
        return axios.get(
            `${baseURL}/notification/unread-count`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    },

    createNotification: (data, authToken) => {
        return axios.post(
            `${baseURL}/notification/create`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );
    }
};