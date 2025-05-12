// components/FrequentlyOrdered.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../../Providers/CartProvider';
import ProductCard from '../../components/ProductCard';
import { useFavorites } from '../../Providers/FavoriteProvider';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth * 0.45; // Each item takes 45% of screen width

const dummyItems = [
    {
        "productId": 1,
        "categoryId": 4,
        "productName": "Stout Ale",
        "description": "Light and crisp stout",
        "image": "https://cdn.pixabay.com/photo/2022/04/07/14/31/bottle-7117637_1280.jpg",
        "brand": "ThirstyBear",
        "categoryName": "Mead",
        "taxCategory": "Alcoholic Beverage",
        "hasTobacco": false,
        "hasCannabis": false,
        "allergenInfo": "Contains barley",
        "nutritionalInfo": "Calories: 124, Carbs: 12g",
        "alcoholByVolume": 5.3,
        "weightGrams": 750,
        "expiryDate": "2026-08-17",
        "alcoholic": true,
        "glutenFree": true,
        "kosher": true,
        "returnable": false,
        "perishable": false,
        "variant":
        {
            "variantId": 101,
            "packageName": "6-Pack Cans",
            "unitPrice": 18.46,
            "volume": "500ml"
        },

    },
    {
        "productId": 2,
        "categoryId": 3,
        "productName": "Pilsner Ale",
        "description": "Bold and hoppy pilsner",
        "image": "https://cdn.pixabay.com/photo/2017/01/21/21/15/beer-1998293_1280.jpg",
        "brand": "ThirstyBear",
        "categoryName": "Cider",
        "taxCategory": "Fermented Beverage",
        "hasTobacco": false,
        "hasCannabis": false,
        "allergenInfo": "Contains barley",
        "nutritionalInfo": "Calories: 174, Carbs: 14g",
        "alcoholByVolume": 6.9,
        "weightGrams": 750,
        "expiryDate": "2027-02-11",
        "alcoholic": true,
        "glutenFree": false,
        "kosher": true,
        "returnable": true,
        "perishable": false,
        "variant":
        {
            "variantId": 104,
            "packageName": "8-Pack Cans",
            "unitPrice": 20.69,
            "volume": "750ml"
        }

    },
];

const FrequentlyOrdered = () => {
    const { updateCart } = useContext(CartContext);
    const { favorites, toggleFavorite } = useFavorites();

    const addToCart = async (item) => {
        var selectedVariant = item.variant;
        const cartData = await AsyncStorage.getItem('cart');
        const currentCart = cartData ? JSON.parse(cartData) : [];

        const exists = currentCart.find((c) => c.id === item.variant.variantId);
        let updatedCart;

        if (exists) {
            updatedCart = currentCart.map((c) =>
                c.id === item.variant.variantId ? { ...c, quantity: c.quantity + 1 } : c
            );
        } else {
            const updatedItem = {
                id: selectedVariant.variantId,
                name: `${item.productName} - ${item.packageName}`,
                price: selectedVariant.unitPrice,
                quantity: 1,
                size: "Small",
                store: "Sample",
                image: item.image,
            };
            updatedCart = [...currentCart, updatedItem];
        }

        await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
        updateCart(updatedCart);
    };


    const renderItem = ({ item }) => (
        <View style={[styles.card, { width: itemWidth }]}>
            <ProductCard
                addToCart={() => addToCart(item)}
                item={item}
                variant={item.variant}
                isFavorite={!!favorites[item.variant.variantId]}
                onFavoriteToggle={() => toggleFavorite(item.variant.variantId)}
                onPress={() => {
                    navigation.navigate('ProductDetailScreen', {
                        product: item, variant: item.variant, isFavorite: favorites[item.variant.variantId],
                    });
                }}
            />
        </View>
    );

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={styles.title}>Frequently Ordered</Text>
            <FlatList
                style={styles.productList}
                data={dummyItems}
                horizontal
                renderItem={renderItem}
                keyExtractor={(item) => item.variant.id}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 10, gap: 12, paddingHorizontal: 12 }}
                showsHorizontalScrollIndicator={false}
                snapToInterval={itemWidth + 12} // + gap
                decelerationRate="fast"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    productList: { paddingHorizontal: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    image: { width: 60, height: 100, resizeMode: 'contain' },
    name: { fontWeight: '600', fontSize: 14, textAlign: 'center', marginTop: 6 },
    size: { fontSize: 12, color: '#555', marginTop: 2 },
    price: { fontSize: 14, fontWeight: 'bold', marginVertical: 4 },
    addBtn: {
        backgroundColor: '#FF6600',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    addText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default FrequentlyOrdered;
