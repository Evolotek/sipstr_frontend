import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function CommonTextInput({ style, placeholder, value, onChangeText, secureTextEntry = false }) {
  return (
    <TextInput
      placeholder={placeholder}
      style={[
        styles.input,
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#999"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Poppins_400Regular',
    backgroundColor: '#fff'
  }
});
