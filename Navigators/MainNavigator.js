// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSelector } from 'react-redux';

// import CartNavigator from "./CartNavigator";
// import HomeNavigator from "./HomeNavigator";
// import NotificationNavigator from './NotificationNavigator';
// import UserNavigator from "./UserNavigator";
// import { NotificationService } from '../Services/NotificationService';
// const Tab = createBottomTabNavigator();
// import { useAuth } from '../Context/Auth';

// const MainNavigator = () => {
//   const cartItems = useSelector(state => state.cart.cartItems);
//   const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0); 

//    const { token } = useAuth();
// const fetchUnreadCount = async () => {
//         if (!token) return;

//         try {
//             const response = await NotificationService.getUnreadCount(token);
//             if (response.data && response.data.unreadCount !== undefined) {
//                 setUnreadCount(response.data.unreadCount);
//             }
//         } catch (err) {
//             console.error('Error fetching unread count:', err);
//         }
//     };
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
//           tabBarIcon: ({ color }) => <Icon name="notifications" color={color} size={30} />
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
// });

// export default MainNavigator;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import CartNavigator from "./CartNavigator";
import HomeNavigator from "./HomeNavigator";
import NotificationNavigator from './NotificationNavigator';
import UserNavigator from "./UserNavigator";
import { NotificationService } from '../Services/NotificationService';
import { useAuth } from '../Context/Auth';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0); 

  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

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
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

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

