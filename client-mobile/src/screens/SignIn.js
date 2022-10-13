import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import SignInForm from "../components/auth/SignInForm";

const SignIn = ({ navigation }) => {
  const {
    state: { auth, fileAuth },
    getAuth,
    getFileAuth,
  } = useContext(AuthContext);

  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text h1>Sign In ({t("auth.Reset Your Password")})</Text>
      <Text>Status is {auth?.status}</Text>
      <SignInForm />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
