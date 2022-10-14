import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button as RNEButton } from "@rneui/themed";
import { buttons } from "../styles/global";

const Button = ({ title, color, onPress }) => {
  return (
    <RNEButton
      title={title}
      color={color}
      buttonStyle={styles.buttons[color || "default"]}
    //   titleStyle={styles.buttons[color || "default"].text}
      onPress={onPress}
    />
  );
};

export default Button;

const styles = StyleSheet.create({
    buttons
});
