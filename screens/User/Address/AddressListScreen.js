import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../components/colors";
import CommonUtils from "../../../Utils/CommonUtils";
import HeaderBar from "../../../components/HeaderBar";
import CommonTextView from "../../../components/CommonTextView";
import { savedAddresses as initialSavedAddresses } from "../../../Utils/StaticData";
import CommonSearchInput from "../../../components/CustomSearchInput";
import CommonTwoButtonAlertBox from "../../../components/CommonTwoButtonAlertBox";

const AddressListScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const [addressList, setAddressList] = useState(initialSavedAddresses);
  const homeAddress = addressList.find((addr) => addr.type === "home");
  const otherAddresses = addressList.filter((addr) => addr.type !== "home");
  const [showDeleteAddAlert, setshowDeleteAddAlert] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleAddLabel = () => {
    navigation.navigate("AddAddress", { mode: "add" });
  };

  const handleEditAddress = (id) => {
    const selectedItem = addressList.find((item) => item.id === id);

    if (!selectedItem) {
      CommonUtils.showToast("Address not found", "error");
      return;
    }

    navigation.navigate("AddAddress", {
      mode: "edit",
      address: selectedItem,
    });
  };

  const handleDeleteAddress = () => {
    if (!selectedAddressId) return;
    const updatedList = addressList.filter(
      (item) => item.id !== selectedAddressId
    );
    setAddressList(updatedList);
    setshowDeleteAddAlert(false);
    setSelectedAddressId(null);
    CommonUtils.showToast("Address deleted successfully!");
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    CommonUtils.showToast(text);
  };

  const handleCancelBtn = () => {};

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (route?.params?.action && route?.params?.updatedAddress) {
        const { action, updatedAddress } = route.params;

        setAddressList((prevList) => {
          if (action === "updated") {
            return prevList.map((addr) =>
              addr.id === updatedAddress.id ? updatedAddress : addr
            );
          } else if (action === "added") {
            return [...prevList, updatedAddress];
          }
          return prevList;
        });

        navigation.setParams({ action: null, updatedAddress: null });
      }
    });

    return unsubscribe;
  }, [navigation, route?.params]);

  const renderAddressItem = (item) => {
    const isHome = item.type === "home";

    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectedAddressId(item.id);
          setshowDeleteAddAlert(true);
        }}
        activeOpacity={0.8}
      >
        <View
          key={item.id}
          style={[styles.addressItem, isHome && styles.selectedAddress]}
        >
          <View style={styles.addressLeft}>
            <View style={styles.addressIconContainer}>
              <Ionicons
                name={isHome ? "home" : "location-outline"}
                size={20}
                color={isHome ? colors.orange : "#999"}
              />
            </View>
            <View style={styles.addressDetails}>
              <CommonTextView style={styles.addressLabel}>
                {item.label}
              </CommonTextView>
              <CommonTextView
                style={styles.addressText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.address}
              </CommonTextView>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleEditAddress(item.id)}>
            <Ionicons name="pencil" size={20} color={colors.orange} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        navigation={navigation}
        title="Addresses"
        style={styles.headerStyle}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <CommonSearchInput
          isRightIconNeedShow={true}
          placeholderText="Search your orders"
          onSearchTextChange={handleSearchTextChange}
          rightIconName="close-circle-outline"
          onRightIconPress={handleCancelBtn}
        />

        {/* Quick Labels */}
        <View style={styles.labelRow}>
          {/* Home label */}
          <TouchableOpacity
            style={styles.labelButton}
            onPress={() => {
              if (homeAddress) handleEditAddress(homeAddress.id);
            }}
          >
            <View style={{ marginRight: 8 }}>
              <Ionicons name="home" size={20} color="#000" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <CommonTextView style={styles.labelText}>Home</CommonTextView>
              <CommonTextView
                style={styles.subAddressText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {homeAddress.address}
              </CommonTextView>
            </View>
          </TouchableOpacity>

          {/* Work label */}
          <TouchableOpacity
            style={styles.labelButton}
            onPress={() => {
              const workAddress = addressList.find((a) => a.type === "work");
              if (workAddress) handleEditAddress(workAddress.id);
            }}
          >
            <View style={{ marginRight: 8 }}>
              <Ionicons name="home" size={20} color="#000" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <CommonTextView style={styles.labelText}>Work</CommonTextView>
              {addressList.find((a) => a.type === "work")?.address && (
                <CommonTextView
                  style={styles.subAddressText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {addressList.find((a) => a.type === "work").address}
                </CommonTextView>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Explore Nearby */}
        <View style={styles.sectionContainer}>
          <CommonTextView style={styles.sectionTitle}>
            Explore Nearby
          </CommonTextView>
          <TouchableOpacity style={styles.currentLocationButton}>
            <Ionicons name="locate-outline" size={22} color="#000" />
            <View>
              <CommonTextView style={styles.currentLocationText}>
                Use current location
              </CommonTextView>
              <CommonTextView style={styles.locationSubtext}>
                Add your address later
              </CommonTextView>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.divider2} />

        {/* Saved Address */}
        <View style={styles.sectionContainer}>
          <CommonTextView style={styles.sectionTitle}>
            Saved Address
          </CommonTextView>
        </View>

        <View style={styles.flatListPadding}>
          {homeAddress && renderAddressItem(homeAddress)}

          <FlatList
            data={otherAddresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderAddressItem(item)}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            removeClippedSubviews={false}
          />
          {/* Alert */}
          <CommonTwoButtonAlertBox
            visible={showDeleteAddAlert}
            title="Delete Address"
            message="Are you sure you want to delete this address?"
            confirmBtnText="Yes"
            cancelBtnText="No"
            onConfirm={handleDeleteAddress}
            onCancel={() => {
              setshowDeleteAddAlert(false);
              setSelectedAddressId(null);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerStyle: {
    margin: 20,
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  subAddressText: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "#888",
    marginTop: 2,
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  labelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  labelText: {
    marginLeft: 5,
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
  addLabelButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addLabelText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 16,
  },
  divider2: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 0,
  },
  sectionContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.black,
    marginBottom: 10,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  currentLocationText: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: colors.black,
  },
  locationSubtext: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#666",
  },
  flatListPadding: {
    paddingHorizontal: 0,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  selectedAddress: {
    backgroundColor: "#FFE1D6",
  },
  addressLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  addressIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
    minWidth: 0, // ✅ allow shrinking
  },
  addressText: {
    fontSize: 12,
    color: "#666",
    flex: 1, // ✅ allow Text to shrink inside flex row
  },
  addressLabel: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#000",
    marginBottom: 2,
  },
});

export default AddressListScreen;
