import axios from "axios";
import { getToken } from "../Utils/StorageHelper";

export const BASE_URL = "http://13.217.21.52:8080/"; //"http://54.237.208.137:8080/"; //"http://98.83.160.176:8080/"; //"http://localhost:8080/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to each request
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  console.log("Token from storage: " + token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
