import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import CartNavigator from "./CartNavigator";
import HomeNavigator from "./HomeNavigator";
import SaveNavigator from "./SaveNavigator";
import UserNavigator from "./UserNavigator";

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0); 

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
        name="Save"
        component={SaveNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="heart-sharp" color={color} size={30} />
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
});

export default MainNavigator;
