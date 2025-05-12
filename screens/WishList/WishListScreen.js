import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { colors } from "../../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBar from "../../components/HeaderBar";
import { favouriteProductsList } from "../../Utils/StaticData";
import ProductCard from "../../components/ProductCard";
import Utils from "../../Utils/CommonUtils";

const WishListScreen = ({ navigation }) => {
  const [favouriteProductsState, setFavouriteProductsState] = useState([]);

  useEffect(() => {
    setFavouriteProductsState(favouriteProductsList);
  }, []);
  const toggleFavorite = (id) => {
    console.log("toggleFavorite called");
    const updated = favouriteProductsState.map((item) =>
      item.id === id ? { ...item, isFav: !item.isFav } : item
    );
    setFavouriteProductsState(updated); // Update state with new favorite status
  };

  const handleAddToCart = (productId) => {
    Utils.showToast("Added product to cart with ID:" + productId);
  };
  const renderItem = ({ item }) => (
    <ProductCard
      item={item}
      isFavorite={item.isFav}
      variant={{
        productName: item.name,
        packageName: "Default",
        unitPrice: parseFloat(item.price),
      }}
      onFavoriteToggle={toggleFavorite}
      onPress={() => console.log("Product pressed", item.id)}
      addToCart={() => handleAddToCart(item.id)}
    />
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <HeaderBar title="Wishlist" navigation={navigation} />
        <FlatList
          data={favouriteProductsState}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={<View style={{ height: 80 }} />}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  wrapper: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default WishListScreen;
