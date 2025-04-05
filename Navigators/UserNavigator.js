import React from 'react'
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack"
const Stack = createStackNavigator();
import Profile from "../Screens/User/Profile";
import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import MyOrder from '../Screens/User/MyOrder';
import TrackOrder from '../Screens/User/TrackOrder';
// import Notification from '../Screens/User/Notification'

function UserNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false
        }}
      />

      <Stack.Screen
        name="MyOrder"
        component={MyOrder}
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

      {/* <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false
        }}
      /> */}
    </Stack.Navigator>
  )

}


export default UserNavigator;