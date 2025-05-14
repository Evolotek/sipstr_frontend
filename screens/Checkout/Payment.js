// components/PaymentMethods.js
import * as React from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import {
  BTVenmoPaymntMethodUsage,
  BoolValue,
  getDeviceDataFromDataCollector,
  requestBillingAgreement,
  requestOneTimePayment,
  tokenizeCardData,
  requestVenmoNonce,
} from 'react-native-expo-braintree';

const clientToken = 'sandbox_x62mvdjj_p8ngm2sczm8248vg';
const merchantAppLink = 'https://braintree-example-app.web.app';

export default function PaymentMethods({ onPaymentSuccess }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState('');

  const handleOneTimePayment = async () => {
    try {
      setIsLoading(true);
      const paymentResult = await requestOneTimePayment({
        clientToken,
        amount: '5', // Replace with dynamic amount if needed
        merchantAppLink,
      });

      setResult(JSON.stringify(paymentResult));
      onPaymentSuccess(paymentResult);
    } catch (ex) {
      console.error(ex);
      Alert.alert('Payment Error', JSON.stringify(ex));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pay with Braintree" onPress={handleOneTimePayment} />
      {isLoading && <ActivityIndicator />}
      {result ? <Text style={styles.resultText}>{result}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    rowGap: 10,
  },
  resultText: {
    marginTop: 10,
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#444',
  },
});
