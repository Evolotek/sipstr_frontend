import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { CartContext } from '../../Providers/CartProvider';
import FrequentlyOrdered from './FrequentlyOrdered';
import { ScrollView } from 'react-native-web';
import DeliveryAddressBar from '../../components/DeliveryAddressBar';
import { useCoupon } from '../../Providers/CouponProvider';

const TAX_RATE = 0.14;

const CartScreen = ({ navigation }) => {
  // Inside CartScreen
  const { updateCart, cartCount, cartVersion } = useContext(CartContext);
  const { appliedCoupon, setAppliedCoupon } = useCoupon();


  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const isFocused = useIsFocused();

  // useEffect becomes:
  useEffect(() => {
    loadCart();
  }, [isFocused, cartCount, cartVersion]); // <-- Add cartVersion here

  // useEffect becomes:
  useEffect(() => {
    if (appliedCoupon)
      setPromoCode(appliedCoupon.code)
  }, [appliedCoupon]); // <-- Add cartVersion here

  const loadCart = async () => {
    const data = await AsyncStorage.getItem('cart');
    setCartItems(data ? JSON.parse(data) : []);
  };

  const saveCart = async (items) => {
    updateCart(items);
    setCartItems(items);
    await AsyncStorage.setItem('cart', JSON.stringify(items));
  };

  const updateQuantity = (id, change) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPromoCode("");
  }
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const discount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0;
  const total = subtotal + tax - discount;

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>📏 Size: {item.size}</Text>
        <Text style={styles.details}>🏬 Store: {item.store}</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            style={styles.qtyBtn}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            style={styles.qtyBtn}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.price}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => removeItem(item.id)}
        style={styles.removeBtn}>
        <Text style={{ fontSize: 18 }}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <DeliveryAddressBar navigation={navigation} onAddressChange={(newAddress) => console.log('Address changed to:', newAddress)} />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Shopping Cart ({cartItems.length} items)</Text>

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />

        <View style={styles.promoRow}>
          <TextInput
            placeholder="Enter promo code"
            style={styles.promoInput}
            value={promoCode}
            onChangeText={setPromoCode}
          />
          {appliedCoupon ? (<TouchableOpacity style={styles.applyBtn} onPress={() => removeCoupon()}>
            <Text style={{ color: '#fff' }}>Remove</Text>
          </TouchableOpacity>) : (<TouchableOpacity style={styles.applyBtn} onPress={() => navigation.navigate("CouponScreen")}>
            <Text style={{ color: '#fff' }}>Apply</Text>
          </TouchableOpacity>)}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text style={styles.summaryText}>Tax: ${tax.toFixed(2)}</Text>
          <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total: ${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
        <FrequentlyOrdered />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: { width: 60, height: 100, resizeMode: 'contain', marginRight: 10 },
  itemInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  details: { fontSize: 12, color: '#666', marginVertical: 2 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  qtyBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  qtyText: { fontSize: 14 },
  price: { fontWeight: '600', fontSize: 14 },
  removeBtn: { padding: 8 },
  promoRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
  },
  applyBtn: {
    backgroundColor: '#FF6600',
    marginLeft: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  summary: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  summaryText: { fontSize: 16, marginBottom: 4 },
  checkoutBtn: {
    backgroundColor: '#FF6600',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CartScreen;
