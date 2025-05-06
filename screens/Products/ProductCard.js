import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonTextView from '../../components/CommonTextView';

const ProductCard = ({ item, isFavorite, variant, onFavoriteToggle, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image || `http://98.83.160.176:8080/${item.variant.thumbnailImageUrl}` }} style={styles.image} />
      <View style={styles.details}>
        <CommonTextView style={styles.name}>{item.productName} - {variant.packageName}</CommonTextView>
        <CommonTextView style={styles.brand}>{item.brand}</CommonTextView>
        <CommonTextView style={styles.price}>From ${Math.min(...item.variantsDTO.map(v => v.unitPrice)).toFixed(2)}</CommonTextView>
        <TouchableOpacity onPress={() => onFavoriteToggle(variant.variantId)}>
         <Ionicons 
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? 'red' : 'gray'}
            style={styles.favorite}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', margin: 10, padding: 10, borderRadius: 8, elevation: 3 },
  image: { width: '100%', height: 100, borderRadius: 6 },
  details: { marginTop: 10 },
  name: { fontSize: 16, fontWeight: 'bold' },
  brand: { fontSize: 14, color: 'gray' },
  price: { fontSize: 16, color: '#FF6600', fontWeight: '600' },
  favorite: { fontSize: 18, CommonTextViewAlign: 'right', marginTop: 5 },
  favorited: { color: 'red' }
});

export default ProductCard;