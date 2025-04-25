import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from 'react-query';
import CommonTextView from "../../../components/CommonTextView";
import CommonButton from "../../../components/CommonButton";
import CommonAppNameLabel from "../../../components/CommonAppNameLabel";
import CommonTextField from "../../../components/CommonTextField";
import { colors } from "../../../components/colors";
import { sendOTP, verifyOTP } from "../../../api/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Logo from "../../../components/Logo";

const VerifyOTPScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  // Send OTP Mutation
  const sendOTPMutation = useMutation({
    mutationFn: sendOTP,
    onSuccess: (data) => {
      if (data.success) {
        Toast.show({ type: 'success', text1: "OTP sent successfully!" });
      } else {
        Toast.show({ type: 'error', text1: "Failed to send OTP" });
      }
    },
    onError: (error) => {
      console.log(error);
      Toast.show({ type: 'error', text1: "Failed to send OTP" });
    },
  });

  // Verify OTP Mutation
  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data.success) {
        navigation.navigate("MainTabs");
      } else {
        Toast.show({ type: 'error', text1: "Failed to verify OTP" });
      }
    },
    onError: (error) => {
      console.log(error);
      Toast.show({ type: 'error', text1: "Failed to verify OTP" });
    },
  });

  useEffect(async () => {
    const userData = await AsyncStorage.getItem('user_data');
    sendOTPMutation.mutate({ mobileNumber: JSON.parse(userData).mobileNumber });
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

  const validateAndSubmit =  async () => {
    const joinedOTP = otp.join("");
    if (joinedOTP.length < 4) {
      Toast.show({ type: 'error', text1: "Please enter the full 4-digit OTP" });
      return;
    }
    const userData = await AsyncStorage.getItem('user_data');
    verifyOTPMutation.mutate({ mobileNumber: JSON.parse(userData).mobileNumber, otp: joinedOTP });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <CommonTextView style={styles.heading}>Verify OTP</CommonTextView>
      <CommonTextView style={styles.instruction}>
        Please enter the 4-digit code sent to your mobileNumber/email.
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

      <CommonButton
        title="Submit"
        onPress={validateAndSubmit}
        loading={verifyOTPMutation.isLoading}
      />
      <TouchableOpacity onPress={async () => {
         const userData = await AsyncStorage.getItem('user_data');
        sendOTPMutation.mutate({ mobileNumber: JSON.parse(userData).mobileNumber })}
        }>
        <CommonTextView style={styles.resendLink}>
          Resend OTP
        </CommonTextView>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,         // Background color
    alignItems: "center",                  // Center horizontally
    justifyContent: "center",              // Center vertically
    padding: 24,                           // Padding around the edges
  },
  heading: {
    fontSize: 24,                          // Main title size
    fontFamily: "Poppins-SemiBold",       // Bold font
    marginTop: 16,                         // Space from the top
  },
  instruction: {
    textAlign: "center",                   // Centered text
    marginVertical: 16,                    // Space above and below
    color: colors.grayText,                // Subtext color
  },
  otpRow: {
    flexDirection: "row",                  // Row layout
    justifyContent: "space-between",       // Evenly space inputs
    width: "80%",                          // 80% of screen width
    marginBottom: 30,                      // Space below OTP fields
  },
  otpInput: {
    width: 50,                             // Input box width
    height: 55,                            // Input box height
    borderRadius: 10,                      // Rounded corners
    borderWidth: 1,                        // Border thickness
    borderColor: colors.orange,           // Border color
    fontSize: 24,                          // Digit font size
    textAlign: "center",                   // Center digit inside box
    fontFamily: "Poppins-SemiBold",       // Font style
  },
  resendLink: {
    marginTop: 20,                         // Space above resend link
    color: colors.orange,                 // Link color
    fontFamily: "Poppins-SemiBold",       // Bold font
    fontSize: 14,                          // Link font size
  },
};


export default VerifyOTPScreen;
