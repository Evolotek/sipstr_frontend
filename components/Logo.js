import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Logo({ style }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/SipStr.png")}
        style={[styles.logo, style]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    //marginTop: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 184,
    height: 108,
  },
});
