import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";

// Welcome Screen
import WelcomeScreen from "../screens/WelcomeScreen/WelcomeScreen";

//Auth Screens
import LoginScreen from "../screens/User/Login/LoginScreen";
import SignUpScreen from "../screens/User/Registration/SignUpScreen";
import SorryScreen from "../screens/WelcomeScreen/SorryScreen";
import ForgotPasswordScreen from "../screens/User/ForgotPassword/ForgotPassword";
import VerifyOTPScreen from "../screens/User/OTP/VerifyOTP";

//Home
import HomeScreen from "../screens/Home/HomeScreen";

//Categories
import CategoriesScreen from "../screens/Products/CategoriesScreen";
import ProductDetailScreen from "../screens/Products/ProductDetailScreen";
import CartScreen from "../screens/Cart/CartScreen";
import CouponScreen from "../screens/Cart/CouponScreen";

//Profile
import AccountSettings from "../screens/User/AccountSettings/AccountSettings";
import EditProfile from "../screens/User/Profile/EditProfile";
import ChangePassword from "../screens/User/ChangePassword/ChangePassword";

//Address
import AddressListScreen from "../screens/User/Address/AddressListScreen";
import AddAddressScreen from "../screens/User/Address/AddAddressScreen";

//Order
import OrderHistory from "../screens/Orders/OrderHistory";
import OrderHistoryDetailsScreen from "../screens/Orders/OrderHistoryDetailsScreen";
import OrderTrackingScreen from "../screens/Orders/OrderTracking";

//Favourite
import WishListScreen from "../screens/WishList/WishListScreen";

const SearchScreen = () => <Text style={styles.pageContent}>Search</Text>;
//const ProfileScreen = () => <Text style={styles.pageContent}>Profile</Text>;

// Contexts
import { CartProvider } from "../Providers/CartProvider";
import { FavoriteProvider } from "../Providers/FavoriteProvider";
import { CouponProvider } from "../Providers/CouponProvider"; // adjust path as needed

import BottomTabs from "../components/BottomTabs";
import TopBar from "../components/CommonTopBar";

const Stack = createNativeStackNavigator();

// const ScreenWithLayout = ({ children, navigation }) => (
//   <View style={{ flex: 1 }}>
//     <Header navigation={navigation} />
//     <View style={{ flex: 1 }}>{children}</View>
//     <BottomTabs navigation={navigation} />
//     <style />
//   </View>
// );

const ScreenWithLayout = ({ children, navigation, hideHeader = false }) => (
  <View style={{ flex: 1 }}>
    {!hideHeader && <TopBar navigation={navigation} showLocation={true} />}
    <View style={{ flex: 1 }}>{children}</View>
    <BottomTabs navigation={navigation} />
  </View>
);

export default function App() {
  return (
    <CartProvider>
      <CouponProvider>
        <FavoriteProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Login">
                {({ navigation }) => <LoginScreen navigation={navigation} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {({ navigation }) => <SignUpScreen navigation={navigation} />}
              </Stack.Screen>
              <Stack.Screen name="Home">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <HomeScreen />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="Search">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <SearchScreen />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="Categories">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <CategoriesScreen />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation} hideHeader={true}>
                    <AccountSettings navigation={navigation} />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="CartScreen">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <CartScreen navigation={navigation} />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="CouponScreen">
                {({ navigation }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <CouponScreen navigation={navigation} />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="SorryScreen" component={SorryScreen} />

              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
              />
              <Stack.Screen name="Addresses" component={AddressListScreen} />
              <Stack.Screen name="AddAddress" component={AddAddressScreen} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} />
              <Stack.Screen name="EditProfile" component={EditProfile} />

              <Stack.Screen name="VerifyOTP">
                {({ navigation, route }) => (
                  <VerifyOTPScreen navigation={navigation} route={route} />
                )}
              </Stack.Screen>
              <Stack.Screen name="ProductDetailScreen">
                {({ navigation, route }) => (
                  <ScreenWithLayout navigation={navigation}>
                    <ProductDetailScreen
                      navigation={navigation}
                      route={route}
                    />
                  </ScreenWithLayout>
                )}
              </Stack.Screen>
              <Stack.Screen name="WishList" component={WishListScreen} />
              <Stack.Screen name="OrderHistory" component={OrderHistory} />
              <Stack.Screen
                name="OrderHistoryDetailsScreen"
                component={OrderHistoryDetailsScreen}
              />
              <Stack.Screen
                name="OrderTrackingScreen"
                component={OrderTrackingScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoriteProvider>
      </CouponProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
  },
});
