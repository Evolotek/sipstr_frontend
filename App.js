import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/User/Login/LoginScreen';
import AppNavigator from './navigations/Navigation';

const queryClient = new QueryClient();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  

  return (
    <QueryClientProvider client={queryClient}>
     <AppNavigator/>
    </QueryClientProvider>
  );
}
