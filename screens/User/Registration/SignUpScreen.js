import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useMutation } from 'react-query';
import { signup } from "../../../api/authService";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import GoogleLogin from "./GoogleLogin";
import AppleLogin from "./AppleLogin";
import CommonError from "../../../components/CommonFieldError";
import CommonTextInput from "../../../components/CommonTextField";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup({ navigation }) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    if (!mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!email) newErrors.email = "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) newErrors.email = "Invalid email address";

    const phoneRegex = /^(\+1\d{10}|\+974\d{8})$/;
    if (mobileNumber && !phoneRegex.test(mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number (+1XXXXXXXXXX or +974XXXXXXXX)";
    }

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
      if (result.success) {
        AsyncStorage.setItem("user_data", formData);
        navigation.navigate("VerifyOTP");
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
      roleEnum: "USER",
      otpSignup: true,
    };

    signupMutation.mutate(payload);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#ffffff' }}>
      <Logo />
      <Text style={{ fontSize: 24, fontWeight: '600', marginVertical: 20, fontFamily: 'Poppins_400Regular', textAlign: 'center' }}>
        Create Account
      </Text>

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

      <Text style={{ marginVertical: 10, textAlign: 'center' }}>
        Already have an account?{" "}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#f97316' }}>Login</Text>
        </TouchableOpacity>
      </Text>

      <Text style={{ color: '#aaa', marginVertical: 10, textAlign: 'center' }}>Or Register with</Text>

      <View style={{ gap: 20, alignItems: 'center' }}>
        <GoogleLogin />
        <AppleLogin />
      </View>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginVertical: 5,
    fontFamily: 'Poppins_400Regular'
  },
  button: {
    backgroundColor: '#f97316',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10
  }
};
