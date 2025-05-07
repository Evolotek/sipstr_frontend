import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CommonTextView from "./CommonTextView";
import { colors } from "./colors";
import { CartContext, CartProvider } from '../Providers/CartProvider';

const Header = ({ navigation, title = "SipStr" }) => {
  const { cartCount } = useContext(CartContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.orange} />
      </TouchableOpacity>
      <CommonTextView style={styles.greeting}>Hi Guest User!</CommonTextView>

      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartContainer}>
        <Ionicons name="cart-outline" size={28} color="#FF6600" />
        {cartCount > -1 && (
          <View style={styles.badge}>
            <CommonTextView style={styles.badgeText}>{cartCount}</CommonTextView>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6600',
  },
  cartContainer: {
    position: 'relative',
    padding: 6,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6600',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: colors.black,
  },
});

export default Header;
