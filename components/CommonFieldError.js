import React from 'react';
import { StyleSheet } from 'react-native';
import CommonTextView from './CommonTextView';

export default function CommonFieldError({ message }) {
  if (!message) return null;
  return <CommonTextView style={styles.errorText}>{message}</CommonTextView>;
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
    fontFamily: 'Poppins',
  },
});
