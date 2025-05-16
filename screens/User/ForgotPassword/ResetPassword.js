import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import { colors } from "../../../components/colors";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonTextField from "../../../components/CommonTextField";
import CommonUtils from "../../../Utils/CommonUtils";
import HeaderBar from "../../../components/HeaderBar";
import CommonTextView from "../../../components/CommonTextView";

const ResetPassword = ({ navigation }) => {
  const [passwordInput, SetPasswordInput] = useState("");
  const [confirmPasswordInput, SetConfirmPasswordInput] = useState("");
  const { setLoading } = useLoader();

  const validateAndChangePwd = () => {
    const password = passwordInput.trim();
    const confirmPassword = confirmPasswordInput.trim();

    if (!password || !confirmPassword) {
      CommonUtils.showToast("All fields are required.", "error");
      return;
    }

    if (!CommonUtils.isPasswordValid(password)) {
      CommonUtils.showToast(
        "Password must include uppercase, lowercase, digit & special char.",
        "error"
      );
      return;
    } else if (password !== confirmPwd) {
      CommonUtils.showToast("Passwords do not match.", "error");
      return;
    }

      CommonUtils.showToast("Password Change Successfully..");
      
      
  };

  const handleResetPassword = async (payload) => {
    try {
      setLoading(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        navigation={navigation}
        title="Reset Password"
        style={styles.headerStyle}
      />
      <Logo />
      <View style={styles.innerContainer}>
        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>New Password</CommonTextView>
          <CommonTextField
            placeholder="Enter New Password"
            secureTextEntry
            value={passwordInput}
            returnKeyType="next"
            onChangeText={SetPasswordInput}
            style={styles.input}
          />
        </View>

        <View style={styles.inputBlock}>
          <CommonTextView style={styles.label}>Confirm Password</CommonTextView>
          <CommonTextField
            placeholder="Confirm Password"
            secureTextEntry={true}
            value={confirmPasswordInput}
            returnKeyType="done"
            onChangeText={SetConfirmPasswordInput}
            style={styles.input}
          />
        </View>

        <CommonButton
          title="Reset Password"
          onPress={validateAndChangePwd}
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
  },
  headerStyle: {
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
  },
  inputBlock: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontFamily: "Poppins-SemiBold",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 8,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default ResetPassword;
