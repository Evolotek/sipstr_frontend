import apiClient from "./APIClient";
import { saveToken, saveUserData } from "../Utils/StorageHelper";

export const loginUser = async ({ email, password }) => {
  try {
    const { data } = await apiClient.post("auth/login", { email, password });
    console.log("Login success:", data);

    const token = data.token || data.data?.token;
    if (!token) throw new Error("Token missing");

    await saveToken(token);
    //apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //after getting token get user's data and save it to local storage
    const profileData = await getMyProfile();
    await saveUserData(profileData);

    return { token };
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// export const signup = async (userData) => {
//   try {
//     const { data } = await apiClient.post("auth/signup", userData);
//     await saveUserData(data);
//     return data;
//   } catch (error) {
//     console.error("Signup error:", error);
//     throw new Error(error.response?.data?.message || "Signup failed");
//   }
// };

export const signup = async (userData) => {
  console.log("Inside SignUp from authService.js");
  const response = await apiClient.post("auth/signup", userData);
  await saveUserData(response.data);
  console.log("Inside SignUp() =>", response); // ✅ now prints properly
  return response; // ✅ must return full response
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
    await saveToken(data.token);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid OTP");
  }
};

export const getMyProfile = async () => {
  try {
    const profileResponse = await apiClient.get("users/me");
    console.log("Profile response:", profileResponse.data);
    return profileResponse.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(
      error.response?.data?.message || "Unable to fetch User data"
    );
  }
};

export const forgotPassword = async ({ email: emailPhone }) => {
  try {
    const data = await apiClient.post(
      `auth/password/forgot?identifier=${encodeURIComponent(emailPhone)}}`,
      {}
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Enable to send OTP on your Email/Phone"
    );
  }
};
