import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./APIClient";
import { saveToken, saveUserData } from "../Utils/StorageHelper";
import { UserModel } from "../data/models/UserModel";

// export const loginUser = async ({ email, password }) => {
//   try {
//     const { data } = await apiClient.post('auth/login', { email, password });
//     await AsyncStorage.setItem('authToken', data.token);
//     return data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || 'Login failed');
//   }
// };

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post("auth/login", { email, password });
    console.log("Login success:", data);

    const token = data.token || data.data?.token;
    if (!token) throw new Error("Token missing");

    await saveToken(token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const profileResponse = await apiClient.get("users/me");
    console.log("Profile response:", profileResponse.data);

    const user = UserModel.fromProfileResponse(profileResponse.data);
    await saveUserData(user);

    return { user, token };
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signup = async (userData) => {
  try {
    const { data } = await apiClient.post("auth/signup", userData);
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const sendOTP = async ({ email }) => {
  try {
    const { data } = await apiClient.post("auth/otp/send", {
      identifier: email,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send OTP");
  }
};

export const verifyOTP = async ({ email, otp }) => {
  try {
    const { data } = await apiClient.post(
      `auth/otp/verify?identifier=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`,
      {} // sending an empty body
    );
    await AsyncStorage.setItem("authToken", data.token);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid OTP");
  }
};
