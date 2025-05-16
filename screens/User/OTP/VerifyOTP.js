import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommonTextView from "../../../components/CommonTextView";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import { colors } from "../../../components/colors";
import { sendOTP, verifyOTP } from "../../../api/authService";
import { getUserData, saveToken } from "../../../Utils/StorageHelper";
import CommonUtils from "../../../Utils/CommonUtils";
import Logo from "../../../components/Logo";
import { useLoader } from "../../../Utils/LoaderContext";
import ApiReactQueryHelper from "../../../api/ApiReactQueryHelper";

const VerifyOTPScreen = ({ navigation, route }) => {
  const { setLoading } = useLoader();
  const { receivedOtp, source, email } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = Array(6)
    .fill()
    .map(() => useRef());

  useEffect(() => {
    if (receivedOtp) {
      console.log("Setting OTP from route:", receivedOtp);
      setOtp(receivedOtp.split(""));
    }
  }, [receivedOtp]);

  // useEffect(() => {
  //   const fetchUserDataAndSendOTP = async () => {
  //     const userData = await getUserData();
  //     sendOTPMutation.mutate({ email: userData.email });
  //   };
  //   fetchUserDataAndSendOTP();
  // }, []);

  const sendOTPMutation = ApiReactQueryHelper.useMutation(sendOTP, {
    setLoading,
    successMessage: "OTP received successful",
    errorMessage: "OTP failed to receive",
    onSuccessCallback: (result) => {
      if (result?.otp) {
        CommonUtils.showToast("OTP sent successfully!", "success");
      } else {
        CommonUtils.showToast("OTP missing from response", "error");
      }
    },
  });

  const verifyOTPMutation = ApiReactQueryHelper.useMutation(verifyOTP, {
    setLoading,
    successMessage: "OTP verified successful",
    errorMessage: "OTP failed to verify",
    onSuccessCallback: async (result) => {
      if (result?.token) {
        if (source === "signup") {
          await saveToken(result);
          navigation.navigate("Home");
        } else if (source === "forgotPassword") {
          navigation.navigate("ResetPassword", { email });
        }
      } else {
        CommonUtils.showToast("OTP missing from response", "error");
      }
    },
  });

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < refs.length - 1) {
      refs[index + 1].current?.focus();
    }
  };

  const handleBackspace = (index, value) => {
    if (value === "" && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const validateAndSubmit = async () => {
    const joinedOTP = otp.join("");
    if (joinedOTP.length < 6) {
      CommonUtils.showToast("Please enter the full 6-digit OTP", "error");
      return;
    }
    setLoading(true);
    const userData = await getUserData();
    verifyOTPMutation.mutate({ email: userData.email, otp: joinedOTP });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <CommonTextView style={styles.heading}>Verify OTP</CommonTextView>
      <CommonTextView style={styles.instruction}>
        Please enter the 6-digit code sent to your mobileNumber/email.
      </CommonTextView>

      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <CommonTextField
            key={index}
            ref={refs[index]}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) =>
              nativeEvent.key === "Backspace" && handleBackspace(index, digit)
            }
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            returnKeyType="done"
          />
        ))}
      </View>

      <CommonButton title="Submit" onPress={validateAndSubmit} />
      <TouchableOpacity
        onPress={async () => {
          setLoading(true);
          const userData = await getUserData();
          sendOTPMutation.mutate({ email: userData.email });
        }}
      >
        <CommonTextView style={styles.resendLink}>Resend OTP</CommonTextView>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontFamily: "Poppins-Regular",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  instruction: {
    textAlign: "center",
    marginVertical: 16,
    color: colors.grayText,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.orange,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    marginHorizontal: 6,
  },
  resendLink: {
    marginTop: 20,
    color: colors.orange,
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
  },
};

export default VerifyOTPScreen;
