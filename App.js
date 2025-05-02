import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/User/Login/LoginScreen';
import AppNavigator from './navigations/Navigation';
import { TouchableOpacity } from 'react-native';
import CategoryScreen from './screens/Products/CategoriesScreen';

const queryClient = new QueryClient();
const Stack = createStackNavigator();
export const Header = ({ navigation }) => {
  const { cartCount } = useContext(CartContext);

  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hi Guest User!</Text>

      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartContainer}>
        <Ionicons name="cart-outline" size={28} color="#FF6600" />
        {cartCount > -1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ScreenWithLayout = ({ children, navigation }) => (
  <View style={{ flex: 1 }}>
    <Header navigation={navigation} />
    <View style={{ flex: 1 }}>{children}</View>
    <FooterTabs navigation={navigation} />
  </View>
);

const FooterTabs = ({ navigation }) => (
  <View style={styles.footerTabs}>
    <Stack.Screen name="Home">
      {({ navigation }) => (
        <ScreenWithLayout navigation={navigation}>
          <HomeScreen />
        </ScreenWithLayout>
      )}
    </Stack.Screen>
    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
      <Ionicons name="search-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
    <Stack.Screen name="Categories">
      {({ navigation }) => (
        <ScreenWithLayout navigation={navigation}>
          <CategoryScreen />
        </ScreenWithLayout>
      )}
    </Stack.Screen>
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      <Ionicons name="person-outline" size={24} color="#FF6600" />
    </TouchableOpacity>
  </View>
);

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
