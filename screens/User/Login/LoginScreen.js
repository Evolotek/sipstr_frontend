import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import CommonTextView from "../../../components/CommonTextView";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonUtils from "../../../Utils/CommonUtils";
import { colors } from "../../../components/colors";
import Logo from "../../../components/Logo";
import Checkbox from "expo-checkbox";
import ApiReactQueryHelper from "../../../api/ApiReactQueryHelper";
import { loginUser } from "../../../api/authService";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setLoading } = useLoader();

  const mutation = ApiReactQueryHelper.useMutation(loginUser, {
    setLoading,
    successMessage: "Login successful",
    errorMessage: "Login failed",
    onSuccessCallback: () => navigation.navigate("Home"),
  });

  const handleLogin = () => {
    if (!username || !password) {
      CommonUtils.showToast("All fields are required.", "error");
      return;
    }

    if (
      !CommonUtils.isEmailValid(username) &&
      !CommonUtils.isPhoneValid(username)
    ) {
      CommonUtils.showToast(
        "Enter a valid email or 10-digit phone number.",
        "error"
      );
      return;
    }

    if (!CommonUtils.isInternetConnected) {
      CommonUtils.showToast("Please connect to Internet!", "error");
      return;
    }

    setLoading(true);
    mutation.mutate({ email: username, password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Logo />
      <CommonTextView style={styles.welcome}>Welcome</CommonTextView>

      <View style={styles.inputContainer}>
        <CommonTextView style={styles.label}>
          Email / Mobile number
        </CommonTextView>
        <CommonTextField
          placeholder="Enter your email / mobile number"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <CommonTextView style={styles.label}>Password</CommonTextView>
        <CommonTextField
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.optionsRow}>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? colors.orange : undefined}
          />
          <CommonTextView style={styles.rememberText}>
            Remember me
          </CommonTextView>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <CommonTextView style={styles.forgotText}>
            Forgot Password?
          </CommonTextView>
        </TouchableOpacity>
      </View>

      <CommonButton title="Login" onPress={handleLogin} style={styles.button} />

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <CommonTextView style={styles.signupText}>
          Don’t have an account?{" "}
          <CommonTextView style={styles.signupLink}>Signup</CommonTextView>
        </CommonTextView>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },

  welcome: {
    fontSize: 24,
    color: colors.black,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 6,
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    //fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 20,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
    color: colors.textViewFontColor,
  },
  forgotText: {
    color: colors.orange,
  },
  button: {
    marginTop: 20,
    width: "100%",
    //borderRadius: 8,
  },
  signupText: {
    fontSize: 16,
    textAlign: "center",
    //fontFamily: "Poppins-Regular",
    marginTop: 20,
    //color: colors.text,
  },
  signupLink: {
    color: colors.orange,
    //fontFamily: "Poppins-SemiBold",
  },
});
