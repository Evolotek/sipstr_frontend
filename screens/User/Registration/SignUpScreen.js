import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useMutation } from 'react-query';
import { signup } from "../../../api/authService";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import GoogleLogin from "./GoogleLogin";
import AppleLogin from "./AppleLogin";
import CommonError from "../../../components/CommonFieldError";
import CommonTextInput from "../../../components/CommonTextField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommonTextView from "../../../components/CommonTextView";

export default function Signup({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "gaura",
    mobileNumber: "",
    email: "gaurav.agrawal0208@gmail.com  ",
    password: "Pass@12345",
    confirmPassword: "Pass@12345",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const validate = () => {
    const newErrors = {};
    const { fullName, mobileNumber, email, password, confirmPassword } = formData;

    if (!fullName) newErrors.fullName = "Full name is required";
  //  if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!email) newErrors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) newErrors.email = "Invalid email address";

    // const phoneRegex = /^(\+1\d{10}|\+974\d{8})$/;
    // if (mobileNumber && !phoneRegex.test(mobileNumber)) {
    //   newErrors.mobileNumber = "Invalid phone number (+1XXXXXXXXXX or +974XXXXXXXX)";
    // }

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // React Query mutation
  const signupMutation = useMutation({
    mutationFn: (payload) => signup(payload),
    onSuccess: (result) => {
      if (result) {
        AsyncStorage.setItem("user_data", JSON.stringify(formData));
        navigation.navigate("VerifyOTP", result.otp);
      } else {
        Toast.show({ type: 'error', text1: result.message || 'Signup failed.' });
      }
    },
    onError: (error) => {
      Toast.show({ type: 'error', text1: error.message || 'Signup failed.' });
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      roleEnum: "CUSTOMER",
      otpSignup: true,
    };

    signupMutation.mutate(payload);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#ffffff' }}>
      <Logo />
      <CommonTextView style={{
        fontFamily: 'Poppins_400Regular',
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 20
      }}>
        Create Account
      </CommonTextView>

      <CommonTextInput placeholder="Enter Name" style={styles.input} onChangeText={(val) => handleChange("fullName", val)} />
      {errors.fullName && <CommonError message={errors.fullName} />}

      <CommonTextInput placeholder="Enter Mobile Number" style={styles.input} onChangeText={(val) => handleChange("mobileNumber", val)} />
      {errors.mobileNumber && <CommonError message={errors.mobileNumber} />}

      <CommonTextInput placeholder="Enter Email" style={styles.input} onChangeText={(val) => handleChange("email", val)} />
      {errors.email && <CommonError message={errors.email} />}

      <CommonTextInput placeholder="Enter Password" secureTextEntry style={styles.input} onChangeText={(val) => handleChange("password", val)} />
      {errors.password && <CommonError message={errors.password} />}

      <CommonTextInput placeholder="Confirm Password" secureTextEntry style={styles.input} onChangeText={(val) => handleChange("confirmPassword", val)} />
      {errors.confirmPassword && <CommonError message={errors.confirmPassword} />}

      <CommonButton
        title={signupMutation.isPending ? "Signing Up..." : "SignUp"}
        onPress={handleSubmit}
        style={styles.button}
        disabled={signupMutation.isPending}
      />

      <CommonTextView style={{ marginVertical: 10, textAlign: 'center' }}>
        Already have an account?{" "}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <CommonTextView style={styles.loginLink}>Login</CommonTextView>
        </TouchableOpacity>
      </CommonTextView>

      <CommonTextView style={{ color: '#aaa', marginVertical: 10, textAlign: 'center' }}>Or Register with</CommonTextView>

      <View style={{ gap: 20, alignItems: 'center' }}>
        <GoogleLogin />
        <AppleLogin />
      </View>
    </ScrollView>
  );
}

const styles = {
  input: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'Poppins',
    backgroundColor: '#fff'
  },
  loginLink: {
    color: '#EA580C',
    fontWeight: '600'
  }
};
