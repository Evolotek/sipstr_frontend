import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../components/colors";
import { useNavigationState } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import CommonTextView from "./CommonTextView";


const BottomTabs = ({ navigation }) => {
  const currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const tabs = [
    { name: "Home", icon: "home-outline" },
    { name: "Search", icon: "search-outline" },
    { name: "Categories", icon: "grid-outline" },
    { name: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={styles.footerTabs}>
      {tabs.map((tab) => {
        const isActive = currentRouteName === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.footerTab}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? colors.orange : "#666"}
            />
            <CommonTextView
              style={[
                styles.footerText,
                { color: isActive ? colors.orange : "#666" },
              ]}
            >
              {tab.name}
            </CommonTextView>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


export default BottomTabs;

const styles = {
  footerTabs: {
    flexDirection: "row",
    height: 60,
    paddingBottom: 4,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  footerTab: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    marginTop: 2,
  },
}
