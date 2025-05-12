import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const saveUserData = async (user) => {
  try {
    await AsyncStorage.setItem("user_data", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem("user_data");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};
