import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommonTextView from "./CommonTextView";
import { colors } from "./colors";

const ProductCard = ({
  item,
  isFavorite,
  variant,
  onFavoriteToggle,
  onPress,
  addToCart,
  isFromWishList,
}) => {
  let imageUrl = "";
  if (isFromWishList) {
    imageUrl = item.image;
  } else {
    imageUrl =
      item.image ||
      `http://98.83.160.176:8080/${item.variant.thumbnailImageUrl}`;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => onFavoriteToggle(item.id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <CommonTextView style={styles.name}>{item.productName}</CommonTextView>
        <CommonTextView style={styles.price}>
          ${variant.unitPrice.toFixed(2)}
        </CommonTextView>
      </View>

      {addToCart && (
        <TouchableOpacity style={styles.addIcon} onPress={() => addToCart()}>
          <Ionicons name="add-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    //resizeMode: "contain",
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
  },
  details: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: "400",
    color: colors.black,
  },
  price: {
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
    fontFamily: "Poppins-SemiBold",
  },
  addIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colors.orange,
    //padding: 6,
    borderRadius: 4,
    elevation: 5,
  },
});

export default ProductCard;
