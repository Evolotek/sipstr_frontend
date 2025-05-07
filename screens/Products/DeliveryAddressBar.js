import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Ionicons import

const DeliveryAddressBar = ({ onAddressChange }) => {
  const [address, setAddress] = useState('New York, NY');

  const handleChange = () => {
    const newAddress = address === 'New York, NY' ? 'Los Angeles, CA' : 'New York, NY';
    setAddress(newAddress);
    onAddressChange?.(newAddress);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <Ionicons name="location-outline" size={18} color="#EA580C" />
        <Text style={styles.addressText}> Delivering to: {address}</Text>
      </View>

      <TouchableOpacity onPress={handleChange}>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD8C8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD8C8',
    fontFamily: 'Poppins'
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5B5B5B',
    marginLeft: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EA580C',
  },
});

export default DeliveryAddressBar;
