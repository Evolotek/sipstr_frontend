import React from "react";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "react-query";
import Toast from "react-native-toast-message";
// import {
//   useFonts,
//   Poppins_400Regular,
//   Poppins_600SemiBold,
//   Poppins_700Bold,
// } from "@expo-google-fonts/poppins";
import AppNavigator from "./navigations/AppNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { LoaderProvider } from "./Utils/LoaderContext";

const queryClient = new QueryClient();
const Stack = createStackNavigator();

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   Poppins_400Regular,
  //   Poppins_600SemiBold,
  //   Poppins_700Bold,
  // });

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "ReggaeOne-Regular": require("./assets/fonts/ReggaeOne-Regular.ttf"),
    "ArefRuqaaInk-Bold": require("./assets/fonts/ArefRuqaaInk-Bold.ttf"),
    "ArefRuqaaInk-Regular": require("./assets/fonts/ArefRuqaaInk-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <LoaderProvider>
        <AppNavigator />
        <Toast />
      </LoaderProvider>
    </QueryClientProvider>
  );
}
