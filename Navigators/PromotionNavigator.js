import React from 'react'
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack"
const Stack = createStackNavigator();

import Promotions from '../Screens/Admin/Promotions';
import PromotionForm from '../Screens/Admin/PromotionForm';

function ProductNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Promotions"
                component={Promotions}
                options={{
                    title: "Promotions",
                    headerShown: false,
                }}
            />

            <Stack.Screen 
            name="PromotionForm" 
            component={PromotionForm} 
            options={{
                title: "PromotionForm",
                headerShown: false,
            }}
            />
        </Stack.Navigator>
    )

}


export default ProductNavigator;