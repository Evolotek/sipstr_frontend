import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Here you can clear any session or token from AsyncStorage
    // Example:
    // AsyncStorage.removeItem('userToken');
    
    // After logout, navigate back to the login screen
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      <Text style={styles.infoText}>This is where the main content of your app can be displayed.</Text>
      <Button title="Logout" onPress={handleLogout} color="#e65100" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 40,
    color: '#777',
  },
});
