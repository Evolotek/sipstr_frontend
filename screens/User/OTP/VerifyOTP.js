import React, { useRef, useState, useEffect, use } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import CommonTextView from "../../../components/CommonTextView";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import { colors } from "../../../components/colors";
import { sendOTP, verifyOTP } from "../../../api/authService";
import { getUserData } from "../../../Utils/StorageHelper";
import CommonUtils from "../../../Utils/CommonUtils";
import Logo from "../../../components/Logo";
import { useLoader } from "../../../Utils/LoaderContext";

const VerifyOTPScreen = ({ navigation, route }) => {
  const { setLoading } = useLoader();

  const [otp, setOtp] = useState(route?.params.split(""));
  //const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  // Send OTP Mutation
  const sendOTPMutation = useMutation({
    mutationFn: sendOTP,
    onSuccess: (data) => {
      setLoading(false);
      if (data.otp) {
        CommonUtils.showToast("OTP sent successfully!", "success");
      } else {
        CommonUtils.showToast("Failed to send OTP", "error");
      }
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
      CommonUtils.showToast("Failed to send OTP", "error");
    },
  });

  // Verify OTP Mutation
  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      setLoading(false);
      if (data.token) {
        navigation.navigate("Home");
      } else {
        CommonUtils.showToast("Failed to verify OTP", "error");
      }
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
      CommonUtils.showToast("Failed to verify OTP", "error");
    },
  });

  useEffect(async () => {
    const userData = await getUserData();
    sendOTPMutation.mutate({ email: JSON.parse(userData).email });
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      refs[index + 1].current.focus();
    }
  };

  const handleBackspace = (index, value) => {
    if (value === "" && index > 0) {
      refs[index - 1].current.focus();
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
    verifyOTPMutation.mutate({
      email: userData.email,
      otp: joinedOTP,
    });
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
          const userData = await getUserData(); //await AsyncStorage.getItem("user_data");
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
    backgroundColor: colors.white, // Background color
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    padding: 24, // Padding around the edges
  },
  heading: {
    fontFamily: "Poppins-Regular",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  instruction: {
    textAlign: "center", // Centered text
    marginVertical: 16, // Space above and below
    color: colors.grayText, // Subtext color
  },
  otpRow: {
    flexDirection: "row", // Row layout
    justifyContent: "center", // Evenly space inputs
    width: "80%", // 80% of screen width
    marginBottom: 30, // Space below OTP fields
  },
  otpInput: {
    width: 50, // Input box width
    height: 55, // Input box height
    borderRadius: 10, // Rounded corners
    borderWidth: 1, // Border thickness
    borderColor: colors.orange, // Border color
    fontSize: 24, // Digit font size
    textAlign: "center", // Center digit inside box
    fontFamily: "Poppins-SemiBold", // Font style
    marginHorizontal: 6,
  },
  resendLink: {
    marginTop: 20, // Space above resend link
    color: colors.orange, // Link color
    fontFamily: "Poppins-SemiBold", // Bold font
    fontSize: 14, // Link font size
  },
};

export default VerifyOTPScreen;
