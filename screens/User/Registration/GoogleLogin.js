import React, { useEffect, useState } from 'react';
import { Button, Text, View, Image, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import GoogleIcon from "react-native-vector-icons/FontAwesome";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1871367732-ojsm59llqo28a2rabf9sirtmep0niclm.apps.googleusercontent.com',
    webClientId: '1871367732-ojsm59llqo28a2rabf9sirtmep0niclm.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to fetch user info', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity disabled={!request} onPress={promptAsync} style={styles.iconButton}>
        <GoogleIcon name="google" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  iconButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10
  }
};