import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { useMutation } from "react-query";
import { signup } from "../../../api/authService";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import CommonTextView from "../../../components/CommonTextView";
import { colors } from "../../../components/colors";
import HeaderBar from "../../../components/HeaderBar";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonUtils from "../../../Utils/CommonUtils";

export default function Signup({ navigation }) {
  const { setLoading } = useLoader();

  const [formData, setFormData] = useState({
    fullName: "gaura",
    mobileNumber: "",
    email: "gaurav.agrawal0208@gmail.com  ",
    password: "Pass@12345",
    confirmPassword: "Pass@12345",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const { fullName, mobileNumber, email, password, confirmPassword } =
      formData;

    if (!fullName) {
      CommonUtils.showToast("Full name is required", "error");
      return false;
    }

    if (!email) {
      CommonUtils.showToast("Email is required", "error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      CommonUtils.showToast("Invalid email address", "error");
      return false;
    }

    if (!password) {
      CommonUtils.showToast("Password is required", "error");
      return false;
    } else if (password.length < 6) {
      CommonUtils.showToast("Password must be at least 6 characters", "error");
      return false;
    }

    if (!confirmPassword) {
      CommonUtils.showToast("Confirm your password", "error");
      return false;
    } else if (password !== confirmPassword) {
      CommonUtils.showToast("Passwords do not match", "error");
      return false;
    }

    return true;
  };

  const signupMutation = useMutation({
    mutationFn: (payload) => signup(payload),
    onSuccess: (result) => {
      setLoading(false);
      if (result) {
        navigation.navigate("VerifyOTP", result.otp);
      } else {
        CommonUtils.showToast(result.message || "Signup failed.", "error");
      }
    },
    onError: (error) => {
      setLoading(false);
      CommonUtils.showToast(error.message || "Signup failed.", "error");
    },
  });

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <HeaderBar navigation={navigation} title="" />
        <Logo />

        <CommonTextView style={styles.createAccountText}>
          Create Account
        </CommonTextView>

        <CommonTextField
          placeholder="Enter Name"
          style={styles.input}
          onChangeText={(val) => handleChange("fullName", val)}
        />

        <CommonTextField
          placeholder="Enter Mobile Number"
          style={styles.input}
          onChangeText={(val) => handleChange("mobileNumber", val)}
        />

        <CommonTextField
          placeholder="Enter Email"
          style={styles.input}
          onChangeText={(val) => handleChange("email", val)}
        />

        <CommonTextField
          placeholder="Enter Password"
          secureTextEntry
          style={styles.input}
          onChangeText={(val) => handleChange("password", val)}
        />

        <CommonTextField
          placeholder="Confirm Password"
          secureTextEntry
          style={styles.input}
          onChangeText={(val) => handleChange("confirmPassword", val)}
        />

        <CommonButton
          title={signupMutation.isPending ? "Signing Up..." : "SignUp"}
          onPress={handleSubmit}
          style={styles.button}
          disabled={signupMutation.isPending}
        />

        <View style={styles.loginText}>
          <CommonTextView>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <CommonTextView style={styles.loginLink}> Login </CommonTextView>
            </TouchableOpacity>
          </CommonTextView>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <CommonTextView style={styles.dividerText}>
            Or Register with
          </CommonTextView>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity>
            <Image
              source={require("../../../assets/images/google.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../../../assets/images/apple.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 24,
  },
  input: {
    width: "100%",
    alignSelf: "center",
  },
  createAccountText: {
    fontSize: 26,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 15,
    textAlign: "center",
  },
  loginLink: {
    color: colors.orange,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "baseline",
  },
  button: {
    width: "100%",
    margin: 15,
    alignSelf: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#CCC",
    margin: 15,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialIcon: {
    height: 40,
    width: 40,
    borderRadius: 8,
    resizeMode: "contain",
  },
  loginText: {
    marginTop: 12,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLink: {
    fontFamily: "Poppins-SemiBold",
    color: colors.orange,
  },
};
