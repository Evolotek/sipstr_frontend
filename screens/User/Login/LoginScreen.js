import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useMutation } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { loginUser, sendOTP, verifyOTP } from '../../../api/authService';
import Logo from '../../../components/Logo';
import CommonButton from '../../../components/CommonButton';
import CommonError from '../../../components/CommonFieldError';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [loginType, setLoginType] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = input field, 2 = OTP screen

  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');

  const loginMutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      await AsyncStorage.setItem('authToken', data.token);
      Toast.show({ type: 'success', text1: 'Login successful!' });
      setTimeout(() => navigation.navigate('Home'), 1500);
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: error.message || 'Login failed.' });
    }
  });

  const sendOtpMutation = useMutation(sendOTP, {
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'OTP sent!' });
      setStep(2);
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: error.message || 'Failed to send OTP' });
    }
  });

  const verifyOtpMutation = useMutation(verifyOTP, {
    onSuccess: async (data) => {
      await AsyncStorage.setItem('authToken', data.token);
      Toast.show({ type: 'success', text1: 'OTP Verified!' });
      setTimeout(() => navigation.navigate('Home'), 1500);
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: error.message || 'Invalid OTP' });
    }
  });

  // Detect type based on input
  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (phoneRegex.test(identifier)) {
      setLoginType('phone');
      setError('');
    } else if (emailRegex.test(identifier)) {
      setLoginType('email');
      setError('');
    } else {
      setLoginType('');
      setError('Please enter a valid email or 10-digit phone number.');
    }
  }, [identifier]);

  const handleEmailLogin = () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    loginMutation.mutate({ email: identifier, password });
  };

  const handleSendOtp = () => {
    sendOtpMutation.mutate({ phone: identifier });
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }
    verifyOtpMutation.mutate({ phone: identifier, otp });
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.welcome}>Welcome</Text>

      <TextInput
        placeholder="Enter Email or Phone Number"
        style={styles.input}
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="default"
        autoCapitalize="none"
      />
      <CommonError message={error} />

      {loginType === 'email' && (
        <>
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <CommonButton title="Login" onPress={handleEmailLogin} />
        </>
      )}

      {loginType === 'phone' && step === 1 && (
        <CommonButton title="Send OTP" onPress={handleSendOtp} />
      )}

      {loginType === 'phone' && step === 2 && (
        <>
          <TextInput
            placeholder="Enter 6-digit OTP"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <CommonError message={otpError} />
          <CommonButton title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupLink}>Don’t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff'
  },
  welcome: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  signupLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#e65100',
    fontWeight: 'bold'
  },
});
