import { useMutation, useQuery } from "react-query";
import CommonUtils from "../Utils/CommonUtils";

const ApiReactQueryHelper = {
  useMutation: (mutationFn, options = {}) => {
    //console.log("✅ Inside useMutation");
    const {
      setLoading,
      successMessage,
      errorMessage,
      onSuccessCallback,
      onErrorCallback,
      mutationKey,
    } = options;

    const wrappedMutationFn = async (params) => {
      //console.log("⚡ wrappedMutationFn CALLED");
      setLoading?.(true);

      try {
        const response = await mutationFn(params);
        //console.log("✅ mutationFn response", response);
        return response.data;
      } catch (e) {
        console.error("🔥 mutationFn threw error", e);
        throw e;
      } finally {
        setLoading?.(false);
        // console.log("🛑 wrappedMutationFn done");
      }
    };

    return useMutation({
      mutationKey,
      mutationFn: wrappedMutationFn,
      onSuccess: async (data) => {
        try {
          console.log("🎉 useMutation SUCCESS", data);
          if (successMessage) CommonUtils.showToast(successMessage, "success");
          await onSuccessCallback?.(data);
        } catch (e) {
          console.log("⚠️ useMutation error block");
          console.error("Error in onSuccessCallback:", e);
        } finally {
          //console.log("✅ useMutation finally block");
          setLoading?.(false);
        }
      },
      onError: (error) => {
        try {
          console.log("❌ useMutation ERROR", error);
          const message =
            error?.message || errorMessage || "Something went wrong";
          CommonUtils.showToast(message, "error");
          onErrorCallback?.(error);
        } catch (e) {
          console.error("Error in onErrorCallback:", e);
        } finally {
          setLoading?.(false);
        }
      },
    });
  },

  useQuery: (queryKey, queryFn, options = {}) => {
    console.log("✅ Inside useQuery");
    const {
      enabled = true,
      successMessage,
      errorMessage,
      onSuccessCallback,
      onErrorCallback,
      setLoading,
    } = options;

    const wrappedQueryFn = async () => {
      try {
        console.log("⚡ wrappedQueryFn CALLED");
        setLoading?.(true);
        const result = await handleApiResponse(queryFn);
        if (!result.success) throw new Error(result.message);
        return result.data;
      } catch (e) {
        console.error("🔥 wrappedQueryFn threw error:", e);
        throw e;
      } finally {
        setLoading?.(false);
        console.log("🛑 wrappedQueryFn done");
      }
    };

    return useQuery({
      queryKey,
      queryFn: wrappedQueryFn,
      enabled,
      onSuccess: async (data) => {
        console.log("🎉 useQuery SUCCESS", data);
        try {
          if (successMessage) CommonUtils.showToast(successMessage, "success");
          await onSuccessCallback?.(data);
        } catch (e) {
          console.error("Error in onSuccessCallback:", e);
        } finally {
          setLoading?.(false);
        }
      },
      onError: (error) => {
        console.log("❌ useQuery ERROR", error);
        try {
          const message = error?.message || errorMessage || "Failed to fetch";
          CommonUtils.showToast(message, "error");
          onErrorCallback?.(error);
        } catch (e) {
          console.error("Error in onErrorCallback:", e);
        } finally {
          setLoading?.(false);
        }
      },
    });
  },
};

const handleApiResponse = async (apiCall) => {
  console.log("🔍 Inside handleApiResponse");
  try {
    const isConnected = await CommonUtils.isInternetConnected?.();
    if (!isConnected) {
      throw new Error("No internet connection. Please check your network.");
    }

    const response = await apiCall();

    if (response?.config) {
      const fullUrl = `${response.config.baseURL || ""}${response.config.url}`;
      console.log("✅ API Success =>", fullUrl);
    }

    return { success: true, data: response.data };
  } catch (error) {
    const apiError = error?.response?.data;
    const config = error?.config;

    if (config) {
      const fullUrl = `${config.baseURL || ""}${config.url}`;
      console.log("❌ API Error =>", fullUrl);
    }

    const message = handleErrorResponse(apiError, error.message);
    throw new Error(message);
  }
};

const handleErrorResponse = (errorObj, fallback = "Something went wrong") => {
  console.log("⚠️ Inside handleErrorResponse");
  if (!errorObj || typeof errorObj !== "object") return fallback;

  if (errorObj?.code === "ECONNABORTED")
    return "Request timed out. Please try again.";
  if (errorObj?.message === "Network Error")
    return "No internet connection. Please check your network.";

  return (
    errorObj.description || errorObj.detail || errorObj.message || fallback
  );
};

export default ApiReactQueryHelper;
