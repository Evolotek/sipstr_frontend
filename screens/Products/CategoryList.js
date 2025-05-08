import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import CommonTextView from '../../components/CommonTextView';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth / 4; // 4 icons per screen

const CategoryList = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.categoryId}
            onPress={() => onSelect(cat.categoryId)}
            style={[styles.itemContainer, { width: ITEM_WIDTH }]}
          >
            <View
              style={[
                styles.iconWrapper,
                selected === cat.categoryId && styles.activeIconWrapper,
              ]}
            >
              <Image source={cat.imageUrl} style={styles.icon} resizeMode="contain" />
            </View>
            <CommonTextView
              style={[
                styles.label,
                selected === cat.categoryId && styles.selectedLabel,
              ]}
            >
              {cat.categoryName}
            </CommonTextView>
            {selected === cat.categoryId && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    fontFamily: 'Poppins'
  },
  itemContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconWrapper: {
    borderWidth: 2,
    borderColor: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  label: {
    marginTop: 6,
    color: '#444',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#FF6600',
  },
  underline: {
    marginTop: 2,
    height: 2,
    width: '80%',
    backgroundColor: '#FF6600',
    borderRadius: 1,
  },
});

export default CategoryList;
