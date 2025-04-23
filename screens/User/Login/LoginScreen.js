import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useMutation } from 'react-query';
import { loginUser } from '../../../api/authService';
import Logo from '../../../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonButton from '../../../components/CommonButton';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      console.log('Token:', data.token);

      await AsyncStorage.setItem('authToken', data.token);
      navigation.navigate('Home');
    },
    onError: (error) => {
      console.error('Login error:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  });

  const handleLogin = () => {
    // Email validation (basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Password validation (check if password is not empty and is at least 6 characters long)
    if (!password || password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
      return;
    }

    mutation.mutate({ email, password });
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.welcome}>Welcome</Text>
      <TextInput
        placeholder="Enter Mobile Number/Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password</Text>
      </TouchableOpacity>
      <CommonButton
        title="Login"
        onPress={handleLogin}
        style={styles.button}
      />
      <Text style={styles.signupText}>
        Don’t have an account?  <TouchableOpacity onPress={handleSignUp}><Text style={styles.signupLink}>Signup</Text></TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor:'#ffffff'
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#e65100',
    textAlign: 'center'
  },
  welcome: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20
  },
  input: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#fff'
  },
  forgot: {
    textAlign: 'right',
    color: '#e65100',
    marginBottom: 20
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777'
  },
  signupLink: {
    color: '#e65100',
    fontWeight: 'bold'
  },
  loginBtn: {
    width: 120
  }
});
