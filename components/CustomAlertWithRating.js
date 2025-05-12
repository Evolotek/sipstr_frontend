import React, { useState } from "react";
import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import CommonTextView from "./CommonTextView";
import CommonButton from "./CommonButton";
import { AirbnbRating } from "react-native-ratings";
import { colors } from "./colors";

const CustomAlertWithRating = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <CommonTextView style={styles.heading}>
            Rate your experience
          </CommonTextView>
          <CommonTextView style={styles.subheading}>
            Tell us how your experience was!
          </CommonTextView>

          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={30}
            showRating={false}
            selectedColor={colors.orange}
            onFinishRating={(val) => setRating(val)}
            starContainerStyle={styles.starContainer}
          />

          <View style={styles.btnContainer}>
            <CommonButton
              title="Cancel"
              onPress={handleCancel}
              style={{
                backgroundColor: "#E5E7EB",
                width: "150",
                marginRight: 20,
              }}
              textStyle={{ color: colors.black }}
            />

            <CommonButton
              title="Submit"
              onPress={handleSubmit}
              style={{ width: "150", marginRight: 20 }}
            />
          </View>

          {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <CommonTextView style={styles.submitText}>Submit</CommonTextView>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.orange,
    marginBottom: 6,
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  starContainer: {
    marginBottom: 20,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 20,
  },
});

export default CustomAlertWithRating;
