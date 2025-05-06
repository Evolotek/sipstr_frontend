import apiClient from "./APIClient";

// Fetch categories
export const fetchCategories = async () => {
    try {
        const { data } = await apiClient.get('categories');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
};


// Example usage in your component
export const fetchProductDetails = async (productId) => {
    try {
        const { data } = await apiClient.get(`/products/${productId}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
};

export const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) throw new Error("Category ID is required");
   // return await apiClient.get(`/products`);
  return await apiClient.get(`/category/${categoryId}/products`);

};

export const fetchStores = async () => {
    try {
        const { data } = await apiClient.get('stores');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
};

