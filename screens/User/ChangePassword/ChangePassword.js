import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import Logo from "../../../components/Logo";
import CommonButton from "../../../components/CommonButton";
import { colors } from "../../../components/colors";
import { useLoader } from "../../../Utils/LoaderContext";
import CommonTextField from "../../../components/CommonTextField";
import CommonUtils from "../../../Utils/CommonUtils";
import HeaderBar from "../../../components/HeaderBar";

const ChangePassword = ({ navigation }) => {
  const [userNameInput, SetuserNameInput] = useState("");
  const [passwordInput, SetPasswordInput] = useState("");
  const [confirmPasswordInput, SetConfirmPasswordInput] = useState("");
  const { setLoading } = useLoader();

  const validateAndChangePwd = () => {
    const emailOrPhone = userNameInput.trim();
    const password = passwordInput.trim();
    const confirmPassword = confirmPasswordInput.trim();

    if (!emailOrPhone || !password || !confirmPassword) {
      CommonUtils.showToast("All fields are required.", "error");
      return;
    }

    if (
      !CommonUtils.isEmailValid(email) &&
      !CommonUtils.isPhoneValid(mobileNumber)
    ) {
      CommonUtils.showToast(
        "Enter a valid email or valid 10-digit USA phone number.",
        "error"
      );
      return;
    } else if (!CommonUtils.isPasswordValid(password)) {
      CommonUtils.showToast(
        "Password must include uppercase, lowercase, digit & special char.",
        "error"
      );
      return;
    } else if (password !== confirmPwd) {
      CommonUtils.showToast("Passwords do not match.", "error");
      return;
    }

    if (!CommonUtils.isInternetConnected) {
      CommonUtils.showToast("Please connect to Internet!", "error");
      return;
    }
    CommonUtils.showToast("Password Change Successfully..");
  };

  const handleChangePassword = async (payload) => {
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
        title="Change Password"
        style={styles.headerStyle}
      />
      <Logo />
      <View style={styles.innerContainer}>
        <CommonTextField
          placeholder="Enter Mobile Number/Email"
          value={userNameInput}
          onChangeText={SetuserNameInput}
          style={styles.input}
        />
        <CommonTextField
          placeholder="Enter Password"
          secureTextEntry
          value={passwordInput}
          returnKeyType="next"
          onChangeText={SetPasswordInput}
          style={styles.input}
        />

        <CommonTextField
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPasswordInput}
          returnKeyType="done"
          onChangeText={SetConfirmPasswordInput}
          style={styles.input}
        />

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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginRight: 8,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default ChangePassword;
