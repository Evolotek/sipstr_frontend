import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import PaymentMethods from './Payment';
import CommonTextView from '../../components/CommonTextView';
import CommonButton from '../../components/CommonButton';

const CheckoutScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [tip, setTip] = useState(0);
    const timeSlots = ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '4:00 PM - 6:00 PM'];
    const tipOptions = [0, 1, 2, 5, 10];
    const [deliveryAddress, setDeliveryAddress] = useState('123 Main St, Springfield');

    const handlePaymentSuccess = (paymentResult) => {
        // You can now use paymentResult.nonce to submit to your backend
        console.log('Payment success:', paymentResult);

        // TODO: send final order to backend including:
        // - cart items
        // - delivery date & slot
        // - total amount
        // - Braintree payment nonce (for actual payment processing)
    };

    const fetchCart = async () => {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );
    const tax = parseFloat((total * 0.1).toFixed(2));

    const placeOrder = () => {
        if (!selectedSlot) {
            alert('Please select a delivery time slot.');
            return;
        }

        // navigation.navigate('Checkout', {
        //     items: cartItems,
        //     total: total + tip,
        //     tax,
        //     deliveryDate,
        //     selectedSlot,
        //     tip,
        // });
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
                <CommonTextView style={styles.name}>{item.name}</CommonTextView>
                <CommonTextView style={styles.price}>${item.price.toFixed(2)}</CommonTextView>
                <CommonTextView style={styles.qty}>Qty: {item.quantity}</CommonTextView>
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Delivery Address */}
            <View style={{ marginTop: 20 }}>
                <CommonTextView style={styles.sectionTitle}>Delivery Address</CommonTextView>
                <TouchableOpacity
                    style={styles.addressBox}
                    onPress={() => {
                        // Here you can open an address picker modal or input screen
                        alert('Open address input screen');
                    }}
                >
                    <CommonTextView>📍 {deliveryAddress}</CommonTextView>
                </TouchableOpacity>
            </View>
            {/* Tip Selection */}
            <View style={{ marginTop: 20 }}>
                <CommonTextView style={styles.sectionTitle}>Add a Tip</CommonTextView>
                <View style={styles.tipContainer}>
                    {tipOptions.map((amount) => (
                        <CommonButton title={amount} onPress={() => setTip(amount)} />

                    ))}
                </View>
            </View>

            <View style={styles.summary}>
                <CommonTextView style={styles.summaryCommonTextView}>Subtotal: ${total.toFixed(2)}</CommonTextView>
                <CommonTextView style={styles.summaryCommonTextView}>Tax (10%): ${tax.toFixed(2)}</CommonTextView>
                <CommonTextView style={styles.summaryCommonTextView}>Tip: ${tip.toFixed(2)}</CommonTextView>
                <CommonTextView style={styles.summaryCommonTextView}>
                    Total: ${(total + tax + tip).toFixed(2)}
                </CommonTextView>
            </View>
            <PaymentMethods onPaymentSuccess={handlePaymentSuccess} />

            {/* Delivery Date Picker */}
            <View style={{ marginTop: 20 }}>
                <CommonTextView style={styles.sectionTitle}>Delivery Date</CommonTextView>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateBox}>
                    <CommonTextView>📅 {deliveryDate.toDateString()}</CommonTextView>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={deliveryDate}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDeliveryDate(selectedDate);
                        }}
                    />
                )}
            </View>

            {/* Time Slot Picker */}
            <View style={{ marginTop: 20 }}>
                <CommonTextView style={styles.sectionTitle}>Delivery Time Slot</CommonTextView>
                <View style={styles.slotContainer}>
                    {timeSlots.map((slot) => (
                        <TouchableOpacity
                            key={slot}
                            style={[styles.slot, selectedSlot === slot && styles.selectedSlot]}
                            onPress={() => setSelectedSlot(slot)}
                        >
                            <CommonTextView style={styles.slotCommonTextView}>{slot}</CommonTextView>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>



            {/* Checkout Button */}
            <CommonButton title="Place Order" onPress={placeOrder} style={styles.checkoutCommonTextView} />
        </ScrollView>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 60,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
    },
    price: {
        fontSize: 14,
        color: '#666',
    },
    qty: {
        fontSize: 13,
        marginTop: 4,
        color: '#999',
    },
    summary: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    summaryCommonTextView: {
        fontSize: 16,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        marginTop: 8,
    },
    slotContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    slot: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
        marginTop: 6,
    },
    selectedSlot: {
        backgroundColor: '#FF6600',
        borderColor: '#FF6600',
    },
    slotCommonTextView: {
        color: '#000',
    },
    tipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tipPill: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
        marginTop: 6,
    },
    selectedTip: {
        backgroundColor: '#FF6600',
        borderColor: '#FF6600',
    },
    checkoutBtn: {
        marginTop: 30,
        backgroundColor: '#FF6600',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutCommonTextView: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
