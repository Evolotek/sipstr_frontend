import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonTextView from './CommonTextView';
import { colors } from './colors';

const ProductCard = ({ item, isFavorite, variant, onFavoriteToggle, onPress, addToCart }) => {
  const imageUrl = item.image || `http://98.83.160.176:8080/${item.variant.thumbnailImageUrl}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => onFavoriteToggle(variant.variantId)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <CommonTextView style={styles.name}>
          {item.productName}
        </CommonTextView>
        <CommonTextView style={styles.subtitle}>
          {variant.packageName || 'Brand Name'}
        </CommonTextView>
        <CommonTextView style={styles.price}>
          From {variant.unitPrice.toFixed(2)}
        </CommonTextView>
      </View>

      {addToCart && (
        <TouchableOpacity style={styles.addIcon} onPress={() => addToCart()}>
          <Ionicons name="add-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#000000",
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 270,
    borderRadius: 6,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 4,
  },
  addIcon: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    backgroundColor: '#EA580C',
    padding: 4,
    elevation: 2,
    borderRadius: 16,
  },
  details: {
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});

export default ProductCard;
