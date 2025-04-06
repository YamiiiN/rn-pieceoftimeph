// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from "axios";
// import CartNavigator from "./CartNavigator";
// import HomeNavigator from "./HomeNavigator";
// import NotificationNavigator from './NotificationNavigator';
// import UserNavigator from "./UserNavigator";
// import { fetchUnreadCount } from '../Redux/Actions/notificationAction'; // Import the action
// import { useAuth } from '../Context/Auth';

// const Tab = createBottomTabNavigator();

// const MainNavigator = () => {
//   const cartItems = useSelector(state => state.cart.cartItems);
//   const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);


//   const unreadCount = useSelector(state =>
//     state.notifications ? state.notifications.unreadCount : 0
//   );
//   const dispatch = useDispatch();
//   const { token } = useAuth();

//   useEffect(() => {
//     if (token) {
      
//       dispatch(fetchUnreadCount(token));

      
//       const interval = setInterval(() => {
//         dispatch(fetchUnreadCount(token));
//       }); 

//       return () => clearInterval(interval);
//     }
//   }, [token, dispatch]);

//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         tabBarHideOnKeyboard: true,
//         tabBarShowLabel: false,
//         tabBarStyle: { backgroundColor: '#584e51' },
//         tabBarActiveTintColor: 'black',
//         tabBarInactiveTintColor: 'white',
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeNavigator}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color }) => <Icon name="home-sharp" color={color} size={30} />
//         }}
//       />

//       <Tab.Screen
//         name="NotificationNavigator"
//         component={NotificationNavigator}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color }) => (
//             <View>
//               <Icon name="notifications" color={color} size={30} />
//               {unreadCount > 0 && (
//                 <View style={styles.badge}>
//                   <Text style={styles.badgeText}>
//                     {unreadCount > 99 ? '99+' : unreadCount}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           )
//         }}
//       />

//       <Tab.Screen
//         name="Cart"
//         component={CartNavigator}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color }) => (
//             <View>
//               <Icon name="cart-sharp" color={color} size={30} />
//               {cartItemCount > 0 && (
//                 <View style={styles.cartBadge}>
//                   <Text style={styles.cartCount}>{cartItemCount}</Text>
//                 </View>
//               )}
//             </View>
//           )
//         }}
//       />

//       <Tab.Screen
//         name="User"
//         component={UserNavigator}
//         options={{
//           headerShown: false,
//           tabBarIcon: ({ color }) => <Icon name="person-sharp" color={color} size={30} />
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   cartBadge: {
//     position: 'absolute',
//     right: -6,
//     top: -4,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartCount: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   badge: {
//     position: 'absolute',
//     right: -6,
//     top: -4,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     minWidth: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 3,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
// });

// export default MainNavigator;

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import CartNavigator from "./CartNavigator";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from './NotificationNavigator';
import UserNavigator from "./UserNavigator";
import { fetchUnreadCount } from '../Redux/Actions/notificationAction';
import { useAuth } from '../Context/Auth';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const unreadCount = useSelector(state =>
    state.notifications ? state.notifications.unreadCount : 0
  );
  const dispatch = useDispatch();
  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;
    
    const fetchNotifications = async () => {
      if (!token || !isMounted) return;
      
      try {
        await dispatch(fetchUnreadCount(token));
      } catch (error) {
      
      }
    };
    
 
    fetchNotifications();
    
  
    const interval = setInterval(fetchNotifications, 30000);
    

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token, dispatch]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: '#584e51' },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'white',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="home-sharp" color={color} size={30} />
        }}
      />

      <Tab.Screen
        name="NotificationNavigator"
        component={NotificationNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="notifications" color={color} size={30} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="cart-sharp" color={color} size={30} />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartCount}>{cartItemCount}</Text>
                </View>
              )}
            </View>
          )
        }}
      />

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="person-sharp" color={color} size={30} />
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MainNavigator;