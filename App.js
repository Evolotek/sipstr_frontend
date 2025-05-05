import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppNavigator from './navigations/AppNavigator';
import { createStackNavigator } from '@react-navigation/stack';

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
      <AppNavigator />
    </QueryClientProvider>
  );
}
