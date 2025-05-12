import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "./colors";

const CommonSearchInput = ({
  isRightIconNeedShow, // Whether the right icon should show or not
  rightIconName, // Right icon name
  placeholderText,
  onRightIconPress,
}) => {
  const [searchText, setSearchText] = useState(""); // State for search text
  const [isFocused, setIsFocused] = useState(false);

  // Handle text change and update search text
  const handleSearchTextChange = (text) => {
    setSearchText(text); // Update the search text state
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* Left-side Search Icon */}
        <Ionicons
          name="search"
          size={20}
          color={isFocused || searchText ? "#A1A1A1" : "#A1A1A1"}
          style={styles.leftIcon}
        />
        {/* TextInput */}
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={searchText}
          onChangeText={handleSearchTextChange}
          placeholder={placeholderText || "Search..."}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#A1A1A1"
        />

        {/* Conditionally render the right-side icon */}
        {isRightIconNeedShow && rightIconName && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.icon}>
            <Ionicons name={rightIconName} size={20} color="#A1A1A1" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    width: "90%",
    padding: 13,
    //paddingHorizontal: 15,
    //height: 30,
  },
  leftIcon: {
    marginRight: 10, // Add some space between the icon and text
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    fontFamily: "Poppins-Regular",
    borderWidth: 0,
    paddingVertical: 0,
    outlineStyle: "none",
  },
  inputFocused: {
    borderWidth: 0, // Ensure no border when focused (if you don't want to show any border)
  },
  icon: {
    marginLeft: 10, // Space between text and right icon
  },
});

export default CommonSearchInput;
