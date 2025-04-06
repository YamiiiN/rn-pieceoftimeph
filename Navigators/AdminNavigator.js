import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardNavigator from './DashboardNavigator'
import ProductNavigator from "./ProductNavigator";
import OrderNavigator from "./OrderNavigator";
import UserNavigator from "./UserNavigator";
import PromotionNavigator from "./PromotionNavigator";

const Tab = createBottomTabNavigator();
const AdminNavigator = () => {

    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarStyle: { backgroundColor: '#584e51' },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'white',
            }}

        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="analytics" color={color} size={30} />
                }}
            />

            <Tab.Screen
                name="ProductNavigator"
                component={ProductNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="add-circle" color={color} size={30} />
                }}
            />
               <Tab.Screen
                name="PromotionNavigator"
                component={PromotionNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="pricetags" color={color} size={30} />
                }}
            />

            <Tab.Screen
                name="OrderNavigator"
                component={OrderNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Icon name="clipboard" color={color} size={30} />
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
    )
}
export default AdminNavigator