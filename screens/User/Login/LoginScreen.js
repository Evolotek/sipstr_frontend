import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useMutation } from "react-query";
import { loginUser } from "../../../api/authService";
import Logo from "../../../components/Logo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonButton from "../../../components/CommonButton";
import CommonError from "../../../components/CommonFieldError";
import Toast from "react-native-toast-message";
import CommonTextInput from "../../../components/CommonTextField";
import CommonTextView from "../../../components/CommonTextView";
import { useLoader } from "../../../Utils/LoaderContext";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(""); // 👈 track form error
  const { setLoading } = useLoader();

  // const mutation = useMutation(loginUser, {
  //   onSuccess: async (data) => {
  //     setLoading(false);
  //     await AsyncStorage.setItem("authToken", data.token);
  //     Toast.show({ type: "success", text1: "Login successful!" });
  //     setTimeout(() => navigation.navigate("Home"), 1500);
  //   },
  //   onError: (error) => {
  //     Toast.show({ type: "error", text1: error.message || "Login failed." });
  //   },
  // });

  const mutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      setLoading(false);

      Toast.show({ type: "success", text1: "Login successful!" });

      // Delay navigation if you want to let Toast show
      setTimeout(() => navigation.navigate("Home"), 1500);
    },
    onError: (error) => {
      setLoading(false);
      Toast.show({ type: "error", text1: error.message || "Login failed." });
    },
  });

  const handleLogin = () => {
    setFormError(""); // clear previous error

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (
      !username ||
      (!emailRegex.test(username) && !phoneRegex.test(username))
    ) {
      setFormError("Please enter a valid email or mobile number.");
      return;
    }

    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    mutation.mutate({ email: username, password });
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Logo />
      <CommonTextView style={styles.welcome}>Welcome</CommonTextView>
      <CommonTextInput
        placeholder="Enter Mobile Number or Email"
        value={username}
        onChangeText={setUsername}
      />
      <CommonTextInput
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <CommonTextView style={styles.forgot}>Forgot Password</CommonTextView>
      </TouchableOpacity>

      {formError ? <CommonError message={formError} /> : null}{" "}
      {/* 👈 Show error here */}
      <CommonButton title="Login" onPress={handleLogin} style={styles.button} />
      
      <CommonTextView style={styles.signupText}>
        Don’t have an account?{" "}
        <CommonTextView onPress={handleSignUp} style={styles.signupLink}>
          Signup
        </CommonTextView>
      </CommonTextView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  welcome: {
    fontFamily: "Poppins",
    fontSize: 28,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: 400,
  },
  input: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Poppins",
    backgroundColor: "#fff",
  },
  forgot: {
    fontFamily: "Poppins",
    textAlign: "right",
    color: "#EA580C",
    marginBottom: 20,
    fontSize: 12,
  },
  signupText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
  signupLink: {
    color: "#EA580C",
    fontWeight: "600",
  },
  button: {
    width: "100%",
  },
});
