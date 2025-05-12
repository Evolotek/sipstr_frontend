import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from 'react-query';
import { fetchProductDetails, fetchStores } from '../../api/categoryService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isStoreClosedToday } from '../../Utils/store';
import { CartContext } from '../../Providers/CartProvider';
import CommonTextView from '../../components/CommonTextView';
import { useFavorites } from '../../Providers/FavoriteProvider';
import DeliveryAddressBar from '../../components/DeliveryAddressBar';

const CART_KEY = 'cart';
const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

const ProductDetailScreen = ({ navigation, route }) => {
  const productId = route?.params?.product?.productId;
  const { toggleFavorite, isFavorite } = useFavorites();
  const variantId = route?.params?.variant?.variantId;
  const favorite = isFavorite(variantId);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(route?.params?.variant);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);
  const { updateCart } = useContext(CartContext);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId),
  });

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: fetchStores,
  });

  useEffect(() => {
    if (stores && stores.length > 0) {
      const firstOpenStore = stores.find((store) => !isStoreClosedToday(store));
      if (firstOpenStore) {
        setSelectedStore(firstOpenStore.storeName);
      }
    }
  }, [stores]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(CART_KEY);
        const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
        const existingItem = cart.find(item => item.id === selectedVariant?.variantId);
        if (existingItem) {
          setQuantity(existingItem.quantity);
          setIsInCart(true);
        } else {
          setQuantity(0);
          setIsInCart(false);
        }
      } catch (e) {
        console.error('Error loading quantity from cart:', e);
      }
    };
    if (selectedVariant) fetchCartQuantity();
  }, [selectedVariant]);



  const updateQuantity = async (newQty) => {
    if (newQty === 0) {
      const jsonValue = await AsyncStorage.getItem(CART_KEY);
      const cart = jsonValue != null ? JSON.parse(jsonValue) : [];
      const updatedCart = cart.filter(item => item.id !== selectedVariant.variantId);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      updateCart(updatedCart);
      setQuantity(0);
      setIsInCart(false);
      return;
    }

    const jsonValue = await AsyncStorage.getItem(CART_KEY);
    const existingCart = jsonValue != null ? JSON.parse(jsonValue) : [];

    const updatedItem = {
      id: selectedVariant.variantId,
      name: `${product.productName} - ${selectedVariant.packageName}`,
      price: selectedVariant.unitPrice,
      quantity: newQty,
      size: selectedSize,
      store: selectedStore,
      image: product.image,
    };

    const withoutSameProduct = existingCart.filter((item) => item.id !== selectedVariant.variantId);
    const newCart = [...withoutSameProduct, updatedItem];

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    updateCart(newCart);
    setQuantity(newQty);
    setIsInCart(true);
  };

  if (productLoading || storesLoading) return <CommonTextView>Loading...</CommonTextView>;

  return (
    <>
      <DeliveryAddressBar navigation={navigation} onAddressChange={(newAddress) => console.log('Address changed to:', newAddress)} />

      <ScrollView>

        <View style={styles.container}>

          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />

            <TouchableOpacity
              onPress={() => toggleFavorite(selectedVariant.variantId)}
              style={styles.favoriteIcon}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={24}
                color={favorite ? 'red' : 'gray'}
              />
            </TouchableOpacity>
          </View>

          <CommonTextView style={styles.name}>{product.productName}</CommonTextView>
          <CommonTextView style={styles.price}>${selectedVariant.unitPrice.toFixed(2)}</CommonTextView>

          <CommonTextView style={styles.sectionTitle}>Select Size</CommonTextView>
          <View style={styles.sizeRow}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}>
                <CommonTextView>{size}</CommonTextView>
              </TouchableOpacity>
            ))}
          </View>

          <CommonTextView style={styles.sectionTitle}>Select Quantity</CommonTextView>
          {quantity === 0 ? (
            <TouchableOpacity
              style={styles.addToCartBtn}
              onPress={() => updateQuantity(1)}>
              <CommonTextView style={styles.addToCartText}>Add to Cart</CommonTextView>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => updateQuantity(Math.max(0, quantity - 1))} style={styles.qtyBtn}>
                <CommonTextView>-</CommonTextView>
              </TouchableOpacity>
              <CommonTextView>{quantity}</CommonTextView>
              <TouchableOpacity onPress={() => updateQuantity(quantity + 1)} style={styles.qtyBtn}>
                <CommonTextView>+</CommonTextView>
              </TouchableOpacity>
            </View>
          )}

          <CommonTextView style={styles.sectionTitle}>Select Store</CommonTextView>
          {stores.map((store, idx) => {
            const isClosed = isStoreClosedToday(store);
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => !isClosed && setSelectedStore(store.storeName)}
                style={[
                  styles.storeCard,
                  selectedStore === store.storeName && styles.selectedStore,
                  isClosed && styles.closedStore,
                ]}
                disabled={isClosed}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <CommonTextView style={styles.storeName}>{store.storeName}</CommonTextView>
                  <CommonTextView>Rating: {store.rating}</CommonTextView>
                </View>
                <CommonTextView style={styles.storeMeta}>Delivery Radius: {store.deliveryRadiusKm} km</CommonTextView>
                <CommonTextView style={styles.storeMeta}>Min Order: ${store.minimumOrderAmount.toFixed(2)}</CommonTextView>
                <CommonTextView style={styles.storeMeta}>Accepting Orders: {store.isCurrentlyAcceptingOrders ? 'Yes' : 'No'}</CommonTextView>
              </TouchableOpacity>
            );
          })}
          <CommonTextView style={styles.storeMeta}>{product.description}</CommonTextView>
          <CommonTextView style={{ "fontWeight": 600, fontSize: 16, marginVertical: 16 }}>Product details:</CommonTextView>
          <View style={styles.detailsGrid}>
            <View style={styles.detailBox}><CommonTextView style={styles.details}>Volume</CommonTextView> <CommonTextView>{selectedVariant.volume}</CommonTextView></View>
            <View style={styles.detailBox}><CommonTextView style={styles.details}>Brand </CommonTextView> <CommonTextView>{product.brand}</CommonTextView></View>
            <View style={styles.detailBox}><CommonTextView style={styles.details}>Alcohol Content </CommonTextView> <CommonTextView>{product.alcoholByVolume}%</CommonTextView></View>
            <View style={styles.detailBox}><CommonTextView style={styles.details}>Category</CommonTextView> <CommonTextView>{product.categoryName}</CommonTextView></View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16 },
  imageContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16
  },

  image: {
    width: '90%',
    height: 300,
  },

  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 6,
  },
  name: { fontSize: 32, fontWeight: '700', marginBottom: 16 },
  price: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 16, fontSize: 12, fontWeight: '600', },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, },
  sizeButton: { padding: 8, borderWidth: 1, fontSize: 12, fontWeight: '600', borderRadius: 8, marginRight: 8 },
  selectedSize: { backgroundColor: '#FFD8C8' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  qtyBtn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  addToCartBtn: { backgroundColor: '#FF6600', padding: 14, borderRadius: 30, marginBottom: 16, alignItems: 'center', fontSize: 20 },
  addToCartText: { color: '#fff', fontWeight: 'bold' },
  storeCard: { borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 8, borderColor: '#99A0AC' },
  selectedStore: { backgroundColor: '#FFD8C8', borderColor: '#FF6600' },
  closedStore: { backgroundColor: '#f0f0f0', borderColor: '#aaa', opacity: 0.5 },
  storeName: { fontSize: 16, fontWeight: '600' },
  storeMeta: { color: '#5B5B5B', fontSize: 14, fontWeight: '400' },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  detailBox: { width: '48%', paddingHorizontal: 16, marginBottom: 16, borderRadius: 8},
  details: { fontSize: 14, fontWeight: '400', color: '#99A0AC' },
});

export default ProductDetailScreen;
