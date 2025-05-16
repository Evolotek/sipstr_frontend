import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Utils from "../../../Utils/CommonUtils";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import Logo from "../../../components/Logo";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../components/colors";
import HeaderBar from "../../../components/HeaderBar";
import CommonTextView from "../../../components/CommonTextView";
import ApiReactQueryHelper from "../../../api/ApiReactQueryHelper";
import { forgotPassword } from "../../../api/authService";
import { useLoader } from "../../../Utils/LoaderContext";

const ForgotPasswordScreen = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const { setLoading } = useLoader();

  const handleResetPassword = () => {
    console.log("test");
    const trimmed = emailOrPhone.trim();
    if (!trimmed) {
      Utils.showToast("Please enter email or phone.", "error");
      return;
    } else if (!Utils.isEmailValid(trimmed) && !Utils.isPhoneValid(trimmed)) {
      Utils.showToast("Enter a valid email or 10-digit phone number.", "error");
      return;
    }

    setLoading(true);
    forgotPasswordMutation.mutate(emailOrPhone);
  };

  const forgotPasswordMutation = ApiReactQueryHelper.useMutation(
    forgotPassword,
    {
      setLoading,
      successMessage: "Forgot Password OTP send",
      errorMessage: "API failed",
      onSuccessCallback: (result) => {
        if (result?.otp) {
          //navigation.navigate("VerifyOTP", result.otp);
          navigation.navigate("VerifyOTP", {
            otp: result.otp,
            source: "forgotPassword",
            email: emailOrPhone, // optional, for resend OTP or resetting
          });
        } else {
          CommonUtils.showToast("OTP missing from response", "error");
        }
      },
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar navigation={navigation} title="Forgot Password" />
      <Logo />
      <View style={styles.container}>
        <CommonTextView>
          Enter the Email or Mobile Number associated with your account
        </CommonTextView>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>
            Email / Mobile Number
          </CommonTextView>
          <CommonTextField
            placeholder="Enter your email or mobile number"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            style={styles.input}
          />
        </View>
        <CommonButton
          title="Reset Password"
          onPress={handleResetPassword}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  container: {
    marginTop: 32,
    width: "100%",
  },
  input: {
    width: "100%",
    marginTop: 20,
  },
  inputBlock: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontFamily: "Poppins-SemiBold",
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default ForgotPasswordScreen;
