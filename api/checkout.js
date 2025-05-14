import apiClient from './APIClient';
import { useMutation } from 'react-query';

export const useCheckoutMutation = () => {
  return useMutation({
    mutationFn: postCheckout,
  });
};

const postCheckout = async (data) => {
  const response = await apiClient.post('https://your-api.com/checkout', data);
  return response.data;
};
