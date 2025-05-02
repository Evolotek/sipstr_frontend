import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const CategoryList = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.categoryId}
            onPress={() => onSelect(cat.categoryId)}
            style={[styles.button, selected === cat.categoryId && styles.active]}
          >
            <Text style={styles.text}>{cat.categoryName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginRight: 10, // spacing between categories
  },
  active: {
    backgroundColor: '#FF6600',
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default CategoryList;
