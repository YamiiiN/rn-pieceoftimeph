import React from 'react'
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack"
const Stack = createStackNavigator();
import Orders from "../Screens/Admin/Orders"
import OrderDetails from "../Screens/Admin/OrderDetails"

function OrderNavigator() {
  return (
   <Stack.Navigator>
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


export default OrderNavigator;