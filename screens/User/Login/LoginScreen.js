import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { useMutation } from "react-query";
import { loginUser } from "../../../api/authService";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import CommonTextView from "../../../components/CommonTextView";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonUtils from "../../../Utils/CommonUtils";
import { colors } from "../../../components/colors";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading } = useLoader();

  const mutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      setLoading(false);
      CommonUtils.showToast("Login successful!", "success");
      setTimeout(() => navigation.navigate("Home"), 1500);
    },
    onError: (error) => {
      setLoading(false);
      CommonUtils.showToast(error.message || "Login failed.", "error");
    },
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
      <CommonTextView style={styles.welcomeText}>Welcome</CommonTextView>

      <CommonTextField
        placeholder="Enter Mobile Number/Email"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <CommonTextField
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <CommonTextView style={styles.forgotText}>
          Forgot Password
        </CommonTextView>
      </TouchableOpacity>

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
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontFamily: "Poppins-SemiBold",
    marginVertical: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginHorizontal: 20,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 8,
    marginLeft: -10,
  },
  forgotText: {
    color: colors.orange,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    textAlign: "right",
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    color: colors.orange,
    fontFamily: "Poppins-SemiBold",
  },
  button: {
    width: "100%",
    marginHorizontal: 25,
    marginVertical: 15,
    alignSelf: "center",
  },
});
