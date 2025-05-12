import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useCoupon } from '../../Providers/CouponProvider';
import { useApplyCoupon, useCoupons } from '../../api/couponService';
import { Ionicons } from "@expo/vector-icons";

const CouponScreen = ({navigation}) => {
    const { data, isLoading: couponsLoading } = useCoupons();
    const { mutate: applyCoupon, isLoading } = useApplyCoupon();
    const { setAppliedCoupon } = useCoupon();

    const handleApply = (code) => {
        applyCoupon(code, {
            onSuccess: (data) => {
                setAppliedCoupon(data);
                navigation.navigate("CartScreen");
            },
            onError: (err) => {
                console.log('Coupon error', err);
                // Show a toast if needed
            },
        });
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Ionicons name="storefront-outline" size={20} color="#333" style={{ marginRight: 8 }} />
                <Text style={styles.bankName}>{item.bank}</Text>
            </View>

            <View style={styles.cardBody}>
                <View>
                    <Text style={styles.discount}>
                        {item.discount}% <Text style={styles.offText}>OFF</Text>
                    </Text>
                    <Text style={styles.validText}>Valid Until : {item.expiry}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn} onPress={() => handleApply(item.code)}>
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (couponsLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF6600" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Coupons</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No coupons available</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    backArrow: { fontSize: 24, color: '#FF6600' },
    title: { fontSize: 22, fontWeight: 'bold' },

    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 8,
        marginBottom: 12,
    },
    bankIcon: { width: 20, height: 20, marginRight: 8 },
    bankName: { fontWeight: 'bold', fontSize: 16 },

    cardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    discount: { fontSize: 24, fontWeight: 'bold' },
    offText: { color: '#FF6600' },
    validText: { marginTop: 4, fontSize: 12, color: '#777' },

    applyBtn: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    applyText: { color: '#fff', fontWeight: 'bold' },
});

export default CouponScreen;
