import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SessionLiteLogoSvg from "../components/svg/SessionLiteLogoSvg";
import { StatusBar } from "expo-status-bar";

const Splash = () => {
  return (
    <>
      <StatusBar style="auto" />
      <View
        style={{
          margin: 30,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 100,
        }}
      >
        <SessionLiteLogoSvg scale={0.4} />
      </View>
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({});
