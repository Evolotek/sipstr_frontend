import { useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery, useInfiniteQuery } from "react-query";
import {
  fetchCategories,
  fetchProductsByCategory,
} from "../../api/categoryService";
import CategoryList from "./CategoryList";
import ProductCard from "../../components/ProductCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useFavorites } from "../../Providers/FavoriteProvider";
import DeliveryAddressBar from "../../components/DeliveryAddressBar";
import CommonTextView from "../../components/CommonTextView";

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { favorites, toggleFavorite } = useFavorites();

  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0].categoryId);
    }
  }, [categories, selectedCategory]);

  const {
    data,
    isLoading: loadingProducts,
    error: productError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", selectedCategory],
    queryFn: ({ pageParam = 0 }) =>
      fetchProductsByCategory(selectedCategory, pageParam),
    getNextPageParam: (lastPage) =>
      !lastPage.last ? lastPage.number + 1 : undefined,
    enabled: !!selectedCategory,
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* <DeliveryAddressBar navigation={navigation} onAddressChange={(newAddress) => console.log('Address changed to:', newAddress)} /> */}

      {loadingCategories ? (
        <ActivityIndicator size="large" color="#FF6600" />
      ) : categoryError ? (
        <CommonTextView style={styles.error}>
          Failed to load categories.
        </CommonTextView>
      ) : (
        <CategoryList
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      )}

      {selectedCategory && (
        <>
          <CommonTextView style={styles.subtitle}>
            {categories.find((cat) => cat.categoryId === selectedCategory)
              ?.categoryName || "Category"}
          </CommonTextView>

          {loadingProducts ? (
            <ActivityIndicator size="small" color="#FF6600" />
          ) : productError ? (
            <CommonTextView style={styles.error}>
              Failed to load products.
            </CommonTextView>
          ) : (
            <FlatList
              style={styles.productList}
              data={
                data?.pages.flatMap((page) =>
                  page.data.content.flatMap((product) =>
                    product.variantsDTO.map((variant) => ({
                      ...product,
                      variant,
                    }))
                  )
                ) || []
              }
              keyExtractor={(item) =>
                `${item.productId}-${item.variant.variantId}`
              }
              numColumns={2}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  variant={item.variant}
                  isFavorite={!!favorites[item.variant.variantId]}
                  onFavoriteToggle={() =>
                    toggleFavorite(item.variant.variantId)
                  }
                  onPress={() => {
                    navigation.navigate("ProductDetailScreen", {
                      product: item,
                      variant: item.variant,
                      isFavorite: favorites[item.variant.variantId],
                    });
                  }}
                />
              )}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{
                paddingBottom: 50,
                paddingTop: 10,
                gap: 12,
              }}
              onEndReached={() => {
                if (hasNextPage) fetchNextPage();
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <ActivityIndicator size="small" color="#FF6600" />
                ) : null
              }
              ListEmptyComponent={
                <CommonTextView style={{ textAlign: "center", marginTop: 20 }}>
                  No products found.
                </CommonTextView>
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: {
    fontSize: 20,
    paddingHorizontal: 16,
    fontWeight: "600",
    marginVertical: 12,
  },
  error: { color: "red", marginVertical: 10 },
  productList: { paddingHorizontal: 16 },
});

export default CategoryScreen;
