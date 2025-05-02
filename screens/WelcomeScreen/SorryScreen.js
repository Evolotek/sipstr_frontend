import React from "react";
import {
  View,
  Platform,
  BackHandler,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonAppNameLabel from "../../components/CommonAppNameLabel";
import CommonTextView from "../../components/CommonTextView";
import { colors } from "../../components/colors";
import Logo from "../../components/Logo";

const SorryScreen = () => {
  const handleExit = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else if (Platform.OS === "ios") {
      Alert.alert("Access Denied", "You must be 21 or older to access this app.");
    } else {
      Alert.alert("Access Denied", "You must be 21 or older to access this site.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
    backgroundColor: "#ffffff",
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
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
    fontFamily: "Poppins"
  },
  message: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "Poppins"
  },
});

export default SorryScreen;
