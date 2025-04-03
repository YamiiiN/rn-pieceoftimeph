import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import baseURL from '../../assets/common/baseUrl';
import { useAuth } from '../../Context/Auth';
import { getToken } from '../../utils/sqliteToken';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useAuth(); // use the auth context

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleLogin = async () => {
  //   try {
  //     const res = await axios.post(`${baseURL}/user/login`, {
  //       email,
  //       password
  //     });

  //     if (res.data.success) {
  //       // store the token and user data using context
  //       await login(res.data.user.token, res.data.user);

  //       const storedToken = await getToken();
  //       console.log('Stored Token:', storedToken)

  //       Toast.show({
  //         type: 'success',
  //         text1: 'Login Successful',
  //         text2: res.data.message || 'Welcome back!',
  //         position: 'bottom'
  //       });
  //       setTimeout(() => {
  //         navigation.navigate('MainNavigator');
  //       }, 1500);

  //     } else {
  //       console.log('Login failed:', res.data);
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Login Failed',
  //         text2: res.data.message || 'Invalid credentials',
  //         position: 'bottom'
  //       });

  //     }
  //   } catch (error) {
  //     console.log('Login error:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'Something went wrong.',
  //       position: 'bottom'
  //     });

  //   }
  // };
  const handleLogin = async () => {
    try {
      const res = await axios.post(`${baseURL}/user/login`, {
        email,
        password
      });

      if (res.data.success) {
        await login(res.data.user.token, res.data.user);

        const storedToken = await getToken();
        console.log('Stored Token:', storedToken)

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: res.data.message || 'Welcome back!',
          position: 'top'
        });

        setTimeout(() => {
          // Check the role of the user
          if (res.data.user.role === 'admin') {
            navigation.navigate('AdminNavigator'); 
          } else {
            navigation.navigate('MainNavigator'); 
          }
        }, 1500);

      } else {
        console.log('Login failed:', res.data);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: res.data.message || 'Invalid credentials',
          position: 'bottom'
        });
      }
    } catch (error) {
      console.log('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong.',
        position: 'bottom'
      });
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          placeholderTextColor="#000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#000"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>Or sign in with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={30} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.noAccountText}>Don't have an account? </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginTop: 15,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(217, 217, 217, 0.63)',
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: 15,
    zIndex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 15,
    zIndex: 1,
  },
  forgotPassword: {
    color: '#ff3131',
    marginTop: 10,
    fontSize: 11,
    marginLeft: 165,
    marginBottom: 25,
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderColor: 'black',
    borderWidth: 3,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#999',
  },
  orText: {
    color: '#999',
    paddingHorizontal: 10,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '60%',
    marginBottom: 20,
    gap: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    color: '#000',
  },
  signUpText: {
    color: '#ff3131',
  },
});