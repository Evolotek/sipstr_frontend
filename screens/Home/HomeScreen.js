import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import CommonTextView from "../../components/CommonTextView";
import { colors } from "../../components/colors";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <CommonTextView>Home</CommonTextView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
