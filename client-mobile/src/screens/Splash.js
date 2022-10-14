import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppLogoSvg from "../components/svg/AppLogoSvg";
import SplashBackgroundSvg from "../components/svg/SplashBackgroundSvg";
import { StatusBar } from "expo-status-bar";

const Splash = () => {
  return (
    <>
      <View
        style={{
          position: "absolute",
        }}
      >
        <SplashBackgroundSvg scale={0.45} />
      </View>
      <View
        style={{
          height: "100%",
          // marginBottom: 30
        }}
      >
        <StatusBar style="auto" />
        <View style={{ flex: 5, 
          alignItems: "center",
          justifyContent: "center" }}>
        <AppLogoSvg scale={0.4} />
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({});
