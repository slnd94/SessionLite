import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import SignInForm from "../components/auth/SignInForm";
import Spacer from "../components/Spacer";
import { StatusBar } from "expo-status-bar";
import AppLogoSvg from "../components/svg/AppLogoSvg";
import SplashBackgroundSvg from "../components/svg/SplashBackgroundSvg";

const SignIn = ({ navigation }) => {
  const {
    state: { auth, fileAuth, errorMessage },
    signin,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  const { t } = useTranslation();

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
        <View
          style={{
            flex: 5,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <AppLogoSvg scale={0.4} />
          {/* <Text h3>{t("auth.Sign In")}</Text> */}
          <Spacer />
          <SignInForm
            onSubmit={async (data) => {
              setProcessing(true);
              const request = await signin(data);
              if (request.success) {
                setProcessing(false);
              } else {
                setProcessing(false);
              }
            }}
          />
          {errorMessage ? (
            <View
              style={{ color: "#white", backgroundColor: "red", padding: 20 }}
            >
              <Text>{t(`auth.There was a problem with your sign in`)}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
