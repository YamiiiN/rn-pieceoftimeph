import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import ProductContainer from "../Screens/Product/ProductContainer";
import SingleProduct from "../Screens/Product/SingleProduct";
import CategoryProducts from "../Screens/Product/CategoryProducts";

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='ProductContainer'
                component={ProductContainer}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='SingleProduct'
                component={SingleProduct}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name='CategoryProducts'
                component={CategoryProducts}
                options={({ route }) => ({
                    title: route.params.category, 
                })}
            />
        </Stack.Navigator>
    );
}

export default function HomeNavigator() {
    return <MyStack />;
}