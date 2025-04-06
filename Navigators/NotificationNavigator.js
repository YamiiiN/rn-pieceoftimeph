import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
const Stack = createStackNavigator();
import Notification from '../Screens/User/Notification';
import TrackOrder from '../Screens/User/TrackOrder';
import SingleProduct from '../Screens/Product/SingleProduct';
const NotificationNavigator = () => {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Notification"
                component={Notification}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="TrackOrder"
                component={TrackOrder}
                options={{
                    headerShown: false
                }}
            />
             <Stack.Screen
                name="SingleProduct"
                component={SingleProduct}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default NotificationNavigator;