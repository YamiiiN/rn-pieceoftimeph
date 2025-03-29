import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"

const Stack = createStackNavigator();

const AdminNavigator= () => {
    
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Products"
                component={Products}
                options={{
                    title: "Products"
                }}
            />
            <Stack.Screen name="ProductForm" component={ProductForm} />
        </Stack.Navigator>
    )
}
export default  AdminNavigator