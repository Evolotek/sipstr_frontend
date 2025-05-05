import React from 'react';
import { StyleSheet, View } from 'react-native';
import CommonTextView from '../../components/CommonTextView';

export default function Home() {
  return (
    <View style={styles.container}>
     <CommonTextView>Home</CommonTextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
