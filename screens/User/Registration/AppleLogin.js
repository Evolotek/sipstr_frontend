import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

export default function AppleLogin() {
  const [user, setUser] = useState(null);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      setUser({
        name: credential.fullName?.givenName ?? 'Unknown',
        email: credential.email,
        userId: credential.user,
      });
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User canceled Apple Sign-In');
      } else {
        console.error('Apple Sign-In Error:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <Text>Welcome, {user.name}!</Text>
      ) : Platform.OS === 'ios' ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{ width: 200, height: 44 }}
          onPress={handleAppleSignIn}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
