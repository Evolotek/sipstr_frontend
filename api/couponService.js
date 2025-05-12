import { useMutation, useQuery } from 'react-query';
import apiClient from './APIClient';

const applyCoupon = async (code) => {
  const response = await apiClient.post('/apply-coupon', { code });
  return response.data;
};

export const useApplyCoupon = () => {
  return useMutation({ mutationFn: applyCoupon });
};

const fetchCoupons = async () => {
  const response = await apiClient.get('/coupons');
  return response.data;
};

export const useCoupons = () => {
  return useQuery(['coupons'], fetchCoupons);
};