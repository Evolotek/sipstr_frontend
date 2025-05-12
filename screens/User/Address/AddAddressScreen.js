// Updated AddAddressScreen with divider below label view

import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CommonTextView from "../../../components/CommonTextView";
import CommonTextField from "../../../components/CommonTextField";
import CommonButton from "../../../components/CommonButton";
import { colors } from "../../../components/colors";
import { countries, states } from "../../../Utils/StaticData";
import HeaderBar from "../../../components/HeaderBar";
import { Dropdown } from "react-native-element-dropdown";

const AddAddressScreen = ({ navigation, route }) => {
  const { mode = "add", address = null } = route?.params || {};

  const [selectedTag, setSelectedTag] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [country, setCountry] = useState("US");
  const [selectedState, setSelectedState] = useState("US");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  //Parse the data for Edit Mode
  useEffect(() => {
    if (mode === "edit" && address) {
      setSelectedTag(address.type);
      setCustomLabel(address.type === "other" ? address.label : "");

      const full = address.address;
      const parts = full.split(",").map((p) => p.trim());

      // Street
      setStreet(parts[0] || "");

      // Apt (if exists)
      setApt(parts[1]?.toLowerCase().includes("apt") ? parts[1] : "");

      // City (usually next)
      setCity(parts[2] || "");

      // State + Zip from 3rd or 4th item
      const zipPattern = /([A-Z]{2})\s+(\d{5})/; // US format
      const lastItems = parts.slice(-2).join(" ");
      const match = lastItems.match(zipPattern);
      if (match) {
        const stateCode = match[1];
        const zipCode = match[2];
        const stateMatch = states.find((s) => s.value === stateCode);
        if (stateMatch) setSelectedState(stateCode);
        setZip(zipCode);
      }

      // Country fallback (check last or second last)
      const countryHint = parts[parts.length - 1];
      const matchedCountry = countries.find((c) =>
        countryHint.toLowerCase().includes(c.label.toLowerCase())
      );
      setCountry(matchedCountry?.value || "US");
    }
  }, []);

  const renderTag = (label, iconName, isAddLabel = false) => {
    const isSelected = selectedTag === label;

    if (isAddLabel) {
      return (
        <TouchableOpacity
          style={styles.addLabelButton}
          onPress={() => setSelectedTag("other")}
        >
          <Ionicons name="add" size={16} color={colors.black} />
          <CommonTextView style={styles.addLabelText}>Add Label</CommonTextView>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.tagItem, isSelected && styles.tagItemSelected]}
        onPress={() => {
          setSelectedTag(isSelected ? "" : label);
          if (!isSelected) setCustomLabel("");
        }}
      >
        <View style={styles.iconWithText}>
          <Ionicons
            name={iconName}
            size={20}
            color={isSelected ? colors.orange : colors.black}
            style={{ marginRight: 8 }}
          />
          <View>
            <CommonTextView
              numberOfLines={1}
              style={[styles.tagLabel, isSelected && { color: colors.orange }]}
            >
              {label}
            </CommonTextView>
            {label.toLowerCase() === "home" && (
              <CommonTextView
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.subText}
              >
                {mode === "edit" && address?.type === "home"
                  ? address.address.split(",")[0]?.trim()
                  : selectedTag === "home" && street
                  ? street
                  : ""}
              </CommonTextView>
            )}

            {label.toLowerCase() === "work" && (
              <CommonTextView
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.subText]}
              >
                {mode === "edit" && address?.type === "work"
                  ? address.address.split(",")[0]?.trim()
                  : selectedTag === "work" && street
                  ? street.split(",")[0]?.trim()
                  : ""}
              </CommonTextView>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDone = () => {
    const label =
      selectedTag === "other"
        ? customLabel || "Other"
        : selectedTag.charAt(0).toUpperCase() + selectedTag.slice(1);
    const fullAddress = `${street}${
      apt ? ", " + apt : ""
    }, ${city}, ${selectedState} ${zip}, ${country}`;

    const newAddress = {
      id: mode === "edit" ? address.id : Date.now().toString(),
      type: selectedTag,
      label: label,
      address: fullAddress,
      isPrimary: mode === "add" && false,
    };

    navigation.navigate("Addresses", {
      action: mode === "edit" ? "updated" : "added",
      updatedAddress: newAddress,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title={mode === "add" ? "Add Address" : "Edit Address"}
        navigation={navigation}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.tagRow}>
          {renderTag("Home", "home")}
          {renderTag("Work", "business")}
          <View style={styles.addLabelWrapper}>
            {renderTag("Other", "add", true)}
          </View>
        </View>

        {selectedTag === "other" && (
          <CommonTextField
            placeholder="Save as"
            value={customLabel}
            onChangeText={setCustomLabel}
            style={styles.formInput}
          />
        )}

        <View style={styles.divider} />

        <View style={styles.formCard}>
          <CommonTextView style={styles.sectionLabel}>Country</CommonTextView>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.dropdownPlaceHolder}
            selectedTextStyle={styles.dropdownSelectedText}
            data={countries}
            labelField="label"
            valueField="value"
            placeholder="Select Country"
            value={country}
            onChange={(item) => setCountry(item.value)}
          />

          <CommonTextView style={styles.sectionLabel}>
            Street address
          </CommonTextView>
          <CommonTextField
            value={street}
            onChangeText={setStreet}
            placeholder="Street Address"
            style={styles.formInput}
          />

          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <CommonTextView style={styles.sectionLabel}>
                Apartment/ Suite
              </CommonTextView>
              <CommonTextField
                value={apt}
                onChangeText={setApt}
                placeholder="Apt / Suite"
                style={styles.formInput}
              />
            </View>
            <View style={styles.flexHalf}>
              <CommonTextView style={styles.sectionLabel}>City</CommonTextView>
              <CommonTextField
                value={city}
                onChangeText={setCity}
                placeholder="City"
                style={styles.formInput}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <CommonTextView style={styles.sectionLabel}>State</CommonTextView>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.dropdownPlaceHolder}
                selectedTextStyle={styles.dropdownSelectedText}
                data={states}
                labelField="label"
                valueField="value"
                placeholder="Select State"
                value={selectedState}
                onChange={(item) => setSelectedState(item.value)}
              />
            </View>
            <View style={styles.flexHalf}>
              <CommonTextView style={styles.sectionLabel}>
                Zip code
              </CommonTextView>
              <CommonTextField
                value={zip}
                onChangeText={setZip}
                placeholder="Zip code"
                style={styles.formInput}
              />
            </View>
          </View>
        </View>

        <CommonButton title="Done" onPress={handleDone} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { paddingHorizontal: 16, paddingBottom: 20 },
  tagRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    padding: 6,
  },
  tagItemSelected: { backgroundColor: "#FFF5F0", borderRadius: 8 },
  iconWithText: { flexDirection: "row", alignItems: "center" },
  tagLabel: { fontSize: 14, fontFamily: "Poppins-SemiBold", color: "#000" },
  subText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#888",
    maxWidth: 120,
    marginTop: 2,
    lineHeight: 16,
  },
  addLabelWrapper: { marginLeft: "auto" },
  addLabelButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addLabelText: { fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 6 },
  sectionLabel: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    marginBottom: 4,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  formInput: { width: "100%", height: 50, marginBottom: 16, borderRadius: 10 },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  dropdownPlaceHolder: {
    fontSize: 14,
    color: colors.placeholder,
    fontFamily: "Poppins-Regular",
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: "Poppins-Regular",
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  flexHalf: { width: "48%" },
  button: { marginTop: 30, width: "100%", alignSelf: "center" },
  divider: { height: 1, backgroundColor: "#eee" },
});

export default AddAddressScreen;
