// import React from 'react';
// import { StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Toast from 'react-native-toast-message';
// import { useEffect } from 'react';

// import Login from './Screens/User/Login';
// import Register from './Screens/User/Register';
// import MainNavigator from './Navigators/MainNavigator';
// import { AuthProvider } from './Context/Auth';
// import { Provider } from 'react-redux';
// import store from './Redux/store';


// import ProductForm from './Screens/Admin/ProductForm';
// import Products from './Screens/Admin/Products';
// import Orders from './Screens/Admin/Orders';

// import { initDatabase } from './Helper/cartDB';

// const Stack = createStackNavigator();

// export default function App() {

//   useEffect(() => {
//     // Initialize the SQLite database
//     initDatabase()
//       .then(() => console.log('Database initialized successfully'))
//       .catch(error => console.error('Database initialization error:', error));

//   }, []);

//   return (
//     <AuthProvider>
//       {/* <Provider store={store}>
//         <NavigationContainer>
//           <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="ProductForm" component={ProductForm} />
//             <Stack.Screen name="Orders" component={Orders} />
//             <Stack.Screen name="Products" component={Products} />
//             <Stack.Screen name="Login" component={Login} />
//             <Stack.Screen name="Register" component={Register} />
//             <Stack.Screen name="MainNavigator" component={MainNavigator} options={{ headerShown: false }} />
//           </Stack.Navigator>
//           <Toast />
//         </NavigationContainer>
//       </Provider> */}

//       <Provider store={store}>

//         <NavigationContainer>
//           <MainNavigator />
//         </NavigationContainer>
//         <Toast />

//       </Provider>

//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });





// import React, { useState, useEffect } from 'react';
// import { StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Toast from 'react-native-toast-message';
// import { AuthProvider, useAuth } from './Context/Auth';
// import { Provider } from 'react-redux';
// import store from './Redux/store';
// import { useNotifications } from './Services/useNotification';

// import Login from './Screens/User/Login';
// import Register from './Screens/User/Register';
// import MainNavigator from './Navigators/MainNavigator';
// import AdminNavigator from './Navigators/AdminNavigator';  

// import { initDatabase } from './Helper/cartDB';

// const Stack = createStackNavigator();

// function AppWrapper() {
//   const { user, loading } = useAuth(); 
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  
//   // Setup notifications - note we're passing the user object
//   const { expoPushToken } = useNotifications(user);

//   useEffect(() => {
//     initDatabase()
//       .then(() => console.log('Database initialized successfully'))
//       .catch(error => console.error('Database initialization error:', error));

//     if (user) {
//       setIsAuthenticated(true);
//     } else {
//       setIsAuthenticated(false);
//     }
//   }, [user]);

//   // Debug log for push token
//   useEffect(() => {
//     if (expoPushToken) {
//       console.log("Push notification token in App.js:", expoPushToken);
//     }
//   }, [expoPushToken]);

//   if (loading) {
//     return <></>; 
//   }

//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login">
//           {isAuthenticated ? (
//             user?.role === 'admin' ? (
//               <Stack.Screen name="AdminNavigator" component={AdminNavigator} options={{headerShown: false}}/>
//             ) : (
//               <Stack.Screen name="MainNavigator" component={MainNavigator} options={{headerShown: false}}/>
//             )
//           ) : (
//             <>
//               <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
//               <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
//             </>
//           )}
//         </Stack.Navigator>
//       </NavigationContainer>
//       <Toast />
//     </Provider>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppWrapper />
//     </AuthProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });





import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from './Context/Auth';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { useNotifications } from './Services/useNotification'; // Import the hook we created

import Login from './Screens/User/Login';
import Register from './Screens/User/Register';
import MainNavigator from './Navigators/MainNavigator';
import AdminNavigator from './Navigators/AdminNavigator';  

import { initDatabase } from './Helper/cartDB';

const Stack = createStackNavigator();

function AppWrapper() {
  const { user, loading } = useAuth(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Setup notifications
  const { expoPushToken, notification } = useNotifications(user);

  useEffect(() => {
    initDatabase()
      // .then(() => console.log('Database initialized successfully'))
      // .catch(error => console.error('Database initialization error:', error));

    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    if (expoPushToken) {
      // console.log("Push notification token:", expoPushToken);
    }
  }, [expoPushToken]);

  if (loading) {
    return <></>; 
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {isAuthenticated ? (
            user?.role === 'admin' ? (
              <Stack.Screen name="AdminNavigator" component={AdminNavigator} options={{headerShown: false}}/>
            ) : (
              <Stack.Screen name="MainNavigator" component={MainNavigator} options={{headerShown: false}}/>
            )
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
              <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

