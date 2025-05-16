import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import CommonButton from "../../../components/CommonButton";
import CommonTextField from "../../../components/CommonTextField";
import { colors } from "../../../components/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Utils from "../../../Utils/CommonUtils";
import HeaderBar from "../../../components/HeaderBar";
import { useLoader } from "../../../Utils/LoaderContext";
import { getUserData, saveUserData } from "../../../Utils/StorageHelper";
import Logo from "../../../components/Logo";
import { getMyProfile } from "../../../api/authService";
import ApiReactQueryHelper from "../../../api/ApiReactQueryHelper";

const EditProfile = ({ navigation }) => {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [PhoneInput, setPhoneInput] = useState("");
  const { setLoading } = useLoader();
  const [userData, setUserData] = useState(null);
  const [initialUserData, setInitialUserData] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const localUser = await getUserData();
      if (localUser) {
        setInitialUserData(localUser);
        setUserData(localUser);
        setNameInput(localUser.fullName);
        setEmailInput(localUser.email);
        setPhoneInput(localUser.mobileNumber);
      }
      setLoading(false);

      refetch();
    };

    loadUser();
  }, []);

  const { data: profileData, isLoading } = ApiReactQueryHelper.useQuery(
    "myProfile",
    getMyProfile,
    {
      enabled: false,
      isLoading: isLoading,
      successMessage: null,
      errorMessage: "Failed to fetch profile",
      onSuccessCallback: async (data) => {
        setUserData(data);
        setNameInput(data.fullName);
        setEmailInput(data.email);
        setPhoneInput(data.mobileNumber);
        await saveUserData(data);
      },
      onErrorCallback: (error) => {
        console.log("Error fetching profile", error.message);
      },
    }
  );

  const validateAndSubmit = () => {
    const name = nameInput.trim();
    const emailOrPhone = emailInput.trim();
    var email = "";
    var mobileNumber = "";

    if (!name || !emailOrPhone) {
      Utils.showToast("All fields are required.", "error");
      return;
    }

    if (Utils.isEmailValid(emailOrPhone)) {
      email = emailOrPhone;
    } else if (Utils.isPhoneValid(emailOrPhone)) {
      mobileNumber = emailOrPhone;
    } else {
      Utils.showToast("Enter a valid email or 10-digit phone number.", "error");
      return;
    }

    //handleProfileUpdate();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        navigation={navigation}
        title="Edit Profile"
        style={styles.headerStyle}
      />
      <Logo />
      <View style={styles.formContainer}>
        <CommonTextField
          placeholder="Enter Name"
          value={nameInput}
          onChangeText={setNameInput}
          returnKeyType="next"
          inputMode="text"
          style={styles.input}
        />
        <CommonTextField
          placeholder="Enter Email"
          value={emailInput}
          onChangeText={setEmailInput}
          returnKeyType="done"
          inputMode="text"
          style={styles.input}
        />

        <CommonTextField
          placeholder="Enter Mobile Number"
          value={PhoneInput}
          onChangeText={setPhoneInput}
          returnKeyType="done"
          inputMode="phone-pad"
          style={styles.input}
        />

        <CommonButton
          title="Save"
          onPress={validateAndSubmit}
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
    padding: 20,
  },
  headerStyle: {
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginTop: 20,
  },
});

export default EditProfile;
