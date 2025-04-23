import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import GoogleIcon from "react-native-vector-icons/FontAwesome";
import AppleIcon from "react-native-vector-icons/FontAwesome";
import { loginUser, signup } from "../../../api/authService";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";

export default function Signup({ navigation }) {
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

  const handleSubmit = async () => {
    const { fullName, mobileNumber, email, password, confirmPassword } = formData;

    // Validation Rules
    if (!fullName || !mobileNumber || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return;
    }

    // US or Qatar phone number check
    const phoneRegex = /^(\+1\d{10}|\+974\d{8})$/;
    if (!phoneRegex.test(mobileNumber)) {
      Alert.alert("Validation Error", "Enter valid US (+1) or Qatar (+974) mobile number");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    const payload = {
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      roleEnum: "USER",
      otpSignup: true,
    };
    try {
      await signup(payload);
      // Alert.alert("Success", "Signup successful");
      await loginUser({email: formData.email, password:formData.password});
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Call your Google login logic here
  };

  const handleAppleLogin = () => {
    // Call your Apple login logic here
  };

  const gotoLogin = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#ffffff' }}>
      <Logo />
      <Text style={{ fontSize: 24, fontWeight: '600', marginVertical: 20, fontFamily: 'Poppins_400Regular' }}>Create Account</Text>

      <TextInput placeholder="Enter Name" style={styles.input} onChangeText={(val) => handleChange("fullName", val)} />
      <TextInput placeholder="Enter Mobile Number/Email" style={styles.input} onChangeText={(val) => handleChange("mobileNumber", val)} />
      <TextInput placeholder="Enter Email" style={styles.input} onChangeText={(val) => handleChange("email", val)} />
      <TextInput placeholder="Enter Password" secureTextEntry style={styles.input} onChangeText={(val) => handleChange("password", val)} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={styles.input} onChangeText={(val) => handleChange("confirmPassword", val)} />

      <CommonButton
        title="SignUp"
        onPress={handleSubmit}
        style={styles.button}
      />

      <Text style={{ marginVertical: 10 }}>Already have an account?  <TouchableOpacity onPress={gotoLogin}><Text style={{ color: '#f97316' }}>Login</Text></TouchableOpacity></Text>

      <Text style={{ color: '#aaa', marginVertical: 10 }}>Or Register with</Text>

      <View style={{ flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.iconButton}>
          <GoogleIcon name="google" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAppleLogin} style={styles.iconButton}>
          <AppleIcon name="apple" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginVertical: 5
  },
  button: {
    backgroundColor: '#f97316',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10
  }
};