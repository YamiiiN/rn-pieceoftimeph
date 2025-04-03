import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import Products from "../Screens/Admin/Products"
import ProductForm from "../Screens/Admin/ProductForm"
import Orders from "../Screens/Admin/Orders"
import OrderDetails from "../Screens/Admin/OrderDetails"

const Stack = createStackNavigator();

const AdminNavigator = () => {

    return (
        <Stack.Navigator>
            {/* <Stack.Screen
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
            /> */}
            <Stack.Screen
                name="Orders"
                component={Orders}
                options={{
                    title: "Orders",
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{
                    title: "OrderDetails",
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}
export default AdminNavigator