import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function CommonFieldError({ message }) {
  if (!message) return null;
  return <Text style={styles.errorText}>{message}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular',
  },
});
