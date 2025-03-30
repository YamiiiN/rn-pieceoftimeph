import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Carts from '../Screens/Cart/Carts';
import CheckoutNavigator from './CheckoutNavigator';

const Stack = createStackNavigator();


function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Carts"
                component={Carts}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="Checkout"
                component={CheckoutNavigator}
                options={{
                    title: 'CHECKOUT',
                    headerStyle: {
                        backgroundColor: '#584e51', 
                    },
                    headerTintColor: '#fff', 
                    headerTitleAlign: 'center', 
                }}
            />

        </Stack.Navigator>
    )
}

export default function CartNavigator() {
    return <MyStack />
}

