import React from "react";
import { View, StyleSheet } from "react-native";
import CommonTextView from "../../components/CommonTextView";
import CommonButton from "../../components/CommonButton";
import { globalStyles } from "../../components/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonAppNameLabel from "../../components/CommonAppNameLabel";
import { colors } from "../../components/colors";
import { getUserData } from "../../Utils/StorageHelper";
import Logo from "../../components/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }) => {
  const navigateToHome = async () => {
    var authToken = await AsyncStorage.getItem('authToken');
    var screenName = authToken ? "Home" : "Login";
    navigation.reset({
      index: 0,
      routes: [{ name: screenName }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      <View style={styles.bottomSection}>
        <CommonTextView style={styles.title}>Are you over 21?</CommonTextView>
        <CommonTextView style={styles.subtitle}>
          You must confirm that you are of legal drinking age to enter
        </CommonTextView>

        <View style={styles.buttonRow}>
          <CommonButton
            title="YES"
            onPress={navigateToHome}
            style={styles.button}
          />
          <CommonButton
            title="NO"
            onPress={() => navigation.navigate("SorryScreen")}
            style={styles.button}
          />
        </View>
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
  bottomSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    fontWeight: "400",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#000000",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    fontFamily: "Poppins"
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    width: 100,
    backgroundColor: colors.orange,
    alignItems: "center",
  },
});

export default WelcomeScreen;