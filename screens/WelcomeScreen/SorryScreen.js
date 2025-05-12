import React from "react";
import { View, Platform, BackHandler, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonAppNameLabel from "../../components/CommonAppNameLabel";
import CommonTextView from "../../components/CommonTextView";
import { colors } from "../../components/colors";
import Logo from "../../components/Logo";
import CommonButton from "../../components/CommonButton";
import HeaderBar from "../../components/HeaderBar";

const SorryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar title="" navigation={navigation} />
      <Logo />

      <View style={styles.messageContainer}>
        <CommonTextView style={styles.title}>Sorry!</CommonTextView>
        <CommonTextView style={styles.message}>
          You should be over 21 years old to be able to access this website.
        </CommonTextView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    color: colors.black,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
  message: {
    fontSize: 18,
    color: colors.black,
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  btnStyle: {
    margin: 15,
  },
});

export default SorryScreen;
