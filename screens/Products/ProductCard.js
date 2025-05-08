import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonTextView from '../../components/CommonTextView';

const ProductCard = ({ item, isFavorite, variant, onFavoriteToggle, onPress }) => {
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
          {item.productName} - {variant.packageName}
        </CommonTextView>
        <CommonTextView style={styles.price}>
          From ${Math.min(...item.variantsDTO.map(v => v.unitPrice)).toFixed(2)}
        </CommonTextView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 12,
    marginRight: 8 
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 6,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 4,
    elevation: 2,
  },
  details: {
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '400',
  },
  brand: {
    fontSize: 14,
    color: 'gray',
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ProductCard;
