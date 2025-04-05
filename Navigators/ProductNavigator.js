import React from 'react'
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack"
const Stack = createStackNavigator();

import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"

function ProductNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    title: "Products",
                    headerShown: false,
                }}
            />

            <Stack.Screen 
            name="ProductForm" 
            component={ProductForm} 
            options={{
                title: "ProductForm",
                headerShown: false,
            }}
            />
        </Stack.Navigator>
    )

}


export default ProductNavigator;