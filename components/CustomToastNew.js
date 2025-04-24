import React from 'react';
import { ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#fff',
      }}
      style={{
        backgroundColor: '#e53935',
        borderLeftColor: '#b71c1c',
        borderLeftWidth: 6,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}
    />
  ),
};
