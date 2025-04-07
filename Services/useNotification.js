// OG CODE TO
// import React, { useEffect, useRef, useState } from 'react';
// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import axios from 'axios';
// import baseURL from '../assets/common/baseUrl';
// import { useAuth } from '../Context/Auth'; 


// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export function useNotifications() {
//     // Get user and token directly from AuthContext
//     const { user, token } = useAuth();

//     const [expoPushToken, setExpoPushToken] = useState('');
//     const [notification, setNotification] = useState(false);
//     const [tokenStatus, setTokenStatus] = useState({
//         registered: false,
//         error: null
//     });
//     const notificationListener = useRef();
//     const responseListener = useRef();

//     // Log when user or token changes to help debug
//     useEffect(() => {
//         if (user) {
//             // console.log('User in useNotifications:', {
//             //     id: user.id || user._id,
//             //     hasToken: !!token,
//             //     tokenLength: token ? token.length : 0
//             // });
//         } else {
//             console.log('No user in useNotifications');
//         }
//     }, [user, token]);

//     useEffect(() => {
//         registerForPushNotifications();

//         notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//             // console.log('Notification received:', notification);
//             setNotification(notification);
//         });

//         responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//             console.log('Notification response:', response);
//             // Handle notification response (e.g., navigate to a specific screen)
//         });

//         return () => {
//             Notifications.removeNotificationSubscription(notificationListener.current);
//             Notifications.removeNotificationSubscription(responseListener.current);
//         };
//     }, []);

//     useEffect(() => {
//         if (expoPushToken && token) {
//             sendPushTokenToBackend();
//         }
//     }, [expoPushToken, token]);

//     const registerForPushNotifications = async () => {
//         if (!Device.isDevice) {
//             console.log('Not a physical device, skipping push notifications');
//             return;
//         }

//         try {
//             const { status: existingStatus } = await Notifications.getPermissionsAsync();
//             // console.log('Initial notification permission status:', existingStatus);

//             let finalStatus = existingStatus;

//             if (existingStatus !== 'granted') {
//                 console.log('Requesting notification permissions...');
//                 const { status } = await Notifications.requestPermissionsAsync();
//                 finalStatus = status;
//                 console.log('Permission request result:', status);
//             }

//             if (finalStatus !== 'granted') {
//                 console.log('Failed to get push notification permissions');
//                 setTokenStatus({
//                     registered: false,
//                     error: 'Permission denied'
//                 });
//                 return;
//             }

//             // Get the token
//             // console.log('Getting Expo push token...');
//             const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//             // console.log('Using project ID:', projectId);

//             const token = await Notifications.getExpoPushTokenAsync({
//                 projectId: projectId,
//             });

//             // console.log('Push token obtained:', token.data);
//             setExpoPushToken(token.data);

//             // Configure for Android
//             if (Platform.OS === 'android') {
//                 // console.log('Setting up Android notification channel');
//                 Notifications.setNotificationChannelAsync('default', {
//                     name: 'default',
//                     importance: Notifications.AndroidImportance.MAX,
//                     vibrationPattern: [0, 250, 250, 250],
//                     lightColor: '#FF231F7C',
//                 });
//             }
//         } catch (error) {
//             console.error('Error getting push token:', error);
//             setTokenStatus({
//                 registered: false,
//                 error: error.message
//             });
//         }
//     };

//     const sendPushTokenToBackend = async () => {
//         if (!expoPushToken) {
//             console.log('No push token available to send');
//             return;
//         }

//         if (!token) {
//             console.log('No authentication token available');
//             return;
//         }

//         try {
//             // console.log('Sending push token to backend:', {
//             //     pushToken: expoPushToken,
//             //     endpoint: `${baseURL}/notification/register-push-token`,
//             //     authTokenLength: token.length
//             // });

//             const response = await axios.post(
//                 `${baseURL}/notification/register-push-token`,
//                 { pushToken: expoPushToken },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 }
//             );

//             // console.log('Push token registration response:', response.data);
//             setTokenStatus({
//                 registered: true,
//                 error: null
//             });
//         } catch (error) {
//             const errorDetail = error.response ?
//                 `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` :
//                 `Error: ${error.message}`;

//             console.error('Error registering push token with backend:', errorDetail);

//             setTokenStatus({
//                 registered: false,
//                 error: errorDetail
//             });
//         }
//     };

//     return {
//         expoPushToken,
//         notification,
//         tokenStatus,
//         resendToken: sendPushTokenToBackend
//     };
// }



// TRIAL PARA SA VIEW NOTIF
import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useAuth } from '../Context/Auth';
import { NotificationService } from './NotificationService';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export function useNotifications() {
    const { user, token } = useAuth();

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [tokenStatus, setTokenStatus] = useState({
        registered: false,
        error: null
    });
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        if (user) {
            console.log('User in useNotifications:', {
                id: user.id || user._id,
                hasToken: !!token,
                tokenLength: token ? token.length : 0
            });
        } else {
            console.log('No user in useNotifications');
        }
    }, [user, token]);

    useEffect(() => {
        registerForPushNotifications();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // console.log('Notification received:', notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log('Notification response:', response);
            // Handle notification response (e.g., navigate to a specific screen)
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        if (expoPushToken && token) {
            sendPushTokenToBackend();
        }
    }, [expoPushToken, token]);


    // pinaka unang ma eexecute
    const registerForPushNotifications = async () => {
        if (!Device.isDevice) {
            console.log('Not a physical device, skipping push notifications');
            return;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            // console.log('Initial notification permission status:', existingStatus);

            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                // console.log('Requesting notification permissions...');
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                // console.log('Permission request result:', status);
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push notification permissions');
                setTokenStatus({
                    registered: false,
                    error: 'Permission denied'
                });
                return;
            }


            // console.log('Getting Expo push token...');
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            // console.log('Using project ID:', projectId);


            // IF GRANTED KUKUNIN PROJECT ID NG EXPO DEV
            const token = await Notifications.getExpoPushTokenAsync({
                projectId: projectId,
            });

            // KAPAG MAY NAKUHA NA ID, SSTORE NIYA DITO USING TOKEN.DATA
            setExpoPushToken(token.data);

            // Configure for Android
            if (Platform.OS === 'android') {
                console.log('Setting up Android notification channel');
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        } catch (error) {
            console.error('Error getting push token:', error);
            setTokenStatus({
                registered: false,
                error: error.message
            });
        }
    };

    const sendPushTokenToBackend = async () => {
        // if (!expoPushToken) {
        //     console.log('No push token available to send');
        //     return;
        // }

        // if (!token) {
        //     console.log('No authentication token available');
        //     return;
        // }

        try {
            console.log('Sending push token to backend:', {
                pushToken: expoPushToken
            });

            // Pass the authentication token as a parameter
            await NotificationService.registerPushToken(expoPushToken, token);

            console.log('Push token registration successful');
            setTokenStatus({
                registered: true,
                error: null
            });
        } catch (error) {
            const errorDetail = error.response ?
                `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` :
                `Error: ${error.message}`;

            console.error('Error registering push token with backend:', errorDetail);

            setTokenStatus({
                registered: false,
                error: errorDetail
            });
        }
    };

    return {
        expoPushToken,
        notification,
        tokenStatus,
        resendToken: sendPushTokenToBackend
    };
}