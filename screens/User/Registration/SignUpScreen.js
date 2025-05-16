import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useMutation } from "react-query";
import { signup } from "../../../api/authService";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import CommonTextView from "../../../components/CommonTextView";
import { colors } from "../../../components/colors";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonUtils from "../../../Utils/CommonUtils";
import Logo from "../../../components/Logo";
import HeaderBar from "../../../components/HeaderBar";
import ApiReactQueryHelper from "../../../api/ApiReactQueryHelper";

export default function Signup({ navigation }) {
  const { setLoading } = useLoader();

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    console.log("SignUp: Validate");
    const { fullName, mobileNumber, email, password, confirmPassword } =
      formData;

    if (!fullName) return show("Full name is required");
    if (!mobileNumber) return show("Mobile number is required");
    if (!email) return show("Email is required");
    if (!CommonUtils.isEmailValid(email)) return show("Invalid email address");
    if (!password) return show("Enter Password");
    if (!CommonUtils.isPasswordValid(password))
      return show(
        "Password must be minimum 8 characters including 1 digit, 1 Upper case, 1 Lower case and 1 Special Character"
      );
    if (password !== confirmPassword) return show("Passwords do not match");
    return true;

    function show(msg) {
      CommonUtils.showToast(msg, "error");
      return false;
    }
  };

  const signupMutation = ApiReactQueryHelper.useMutation(signup, {
    setLoading,
    successMessage: "SignUp successful",
    errorMessage: "SignUp failed",
    onSuccessCallback: (result) => {
      console.log("SignUp : onSuccessCallback:  ", result);
      if (result?.otp) {
        console.log("SignUp : OTP:  ", result.otp);
        navigation.navigate("VerifyOTP", {
          otp: result.otp,
          source: "SignUp",
        });
      } else {
        CommonUtils.showToast("OTP missing from response", "error");
      }
    },
    onErrorCallback: (err) => {
      console.log("🔥 Signup onErrorCallback triggered", err.message);
      CommonUtils.showToast(err.message, "error");
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      roleName: "CUSTOMER",
    };
    signupMutation.mutate(payload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar navigation={navigation} title="" />
      <Logo />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <CommonTextView style={styles.welcome}>Welcome</CommonTextView>
        <CommonTextView style={styles.subtitle}>
          Signup to create account
        </CommonTextView>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Name</CommonTextView>
          <CommonTextField
            placeholder="Enter your name"
            value={formData.fullName}
            onChangeText={(val) => handleChange("fullName", val)}
          />
        </View>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Mobile Number</CommonTextView>
          <CommonTextField
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChangeText={(val) => handleChange("mobileNumber", val)}
          />
        </View>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Email</CommonTextView>
          <CommonTextField
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(val) => handleChange("email", val)}
          />
        </View>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Password</CommonTextView>
          <CommonTextField
            placeholder="Enter password"
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => handleChange("password", val)}
          />
        </View>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Confirm Password</CommonTextView>
          <CommonTextField
            placeholder="Confirm password"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(val) => handleChange("confirmPassword", val)}
          />
        </View>

        <CommonButton
          title={signupMutation.isPending ? "Signing Up..." : "Sign up"}
          onPress={handleSubmit}
          disabled={signupMutation.isPending}
          style={styles.button}
        />

        <View style={styles.loginText}>
          <CommonTextView>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <CommonTextView style={styles.loginLink}>Login</CommonTextView>
            </TouchableOpacity>
          </CommonTextView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    //paddingTop: 10,
  },
  welcome: {
    fontSize: 24,
    color: colors.black,
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Poppins-SemiBold",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 6,
  },
  inputBlock: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontFamily: "Poppins-SemiBold",
  },
  button: {
    marginTop: 20,
    width: "100%",
  },
  loginText: {
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  loginLink: {
    color: colors.orange,
    fontFamily: "Poppins-SemiBold",
  },
});
