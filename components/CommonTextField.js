import React from "react";
import { TextInput } from "react-native";
import { colors } from "./colors";
import { globalStyles } from "./styles";

const CommonTextField = forwardRef(
  (
    { style, placeholder, value, onChangeText, secureTextEntry = false },
    ref
  ) => {
    return (
      <TextInput
        style={[
          globalStyles.input,
          { borderColor: colors.textInputBorderColor, color: colors.text },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    );
  }
);

export default CommonTextField;

// export default function CommonTextInput({ style, placeholder, value, onChangeText, secureTextEntry = false }) {
//   return (
//     <TextInput
//       placeholder={placeholder}
//       style={[
//         styles.input,
//         style,
//       ]}
//       value={value}
//       onChangeText={onChangeText}
//       secureTextEntry={secureTextEntry}
//       placeholderTextColor="#999"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   input: {
//     height: 46,
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     paddingHorizontal: 16,
//     fontSize: 16,
//     marginBottom: 20,
//     fontFamily: 'Poppins_400Regular',
//     backgroundColor: '#fff'
//   }
// });
