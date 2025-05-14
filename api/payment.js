import { useConfirmPayment, isApplePaySupported, presentApplePay, createPaymentMethod } from '@stripe/stripe-react-native';
import apiClient from './APIClient';
import api from 'js-cookie';

export const useStripePayment = () => {
  const { confirmPayment, loading } = useConfirmPayment();

  const payWithCard = async (amount, billingDetails = {}) => {
    const { data } = await apiClient.post('https://your-api.com/create-payment-intent', {
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    const { clientSecret } = data;
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });

    if (error) throw error;
    return paymentIntent;
  };

  const payWithAppleGooglePay = async (amount) => {
    const { data } = await api.post('https://your-api.com/create-payment-intent', {
      amount: Math.round(amount * 100),
      currency: 'usd',
    });

    const { clientSecret } = data;

    const applePaySupported = await isApplePaySupported();

    const { error } = await presentApplePay({
      cartItems: [{ label: 'Total', amount: amount.toFixed(2) }],
      country: 'US',
      currency: 'USD',
    });

    if (error) throw error;

    const { error: confirmError, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (confirmError) throw confirmError;
    return paymentIntent;
  };

  return {
    payWithCard,
    payWithAppleGooglePay,
    loading,
  };
};
