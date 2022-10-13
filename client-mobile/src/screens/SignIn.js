import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import SignInForm from "../components/auth/SignInForm";
import Spacer from "../components/Spacer";

const SignIn = ({ navigation }) => {
  const {
    state: { auth, fileAuth },
    getAuth,
    getFileAuth,
  } = useContext(AuthContext);

  const { t } = useTranslation();

  return (
    <View style={{ margin: 30, flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text h3>{t("auth.Sign In")}</Text>
      {/* <Text>Status is {auth?.status}</Text> */}
      <Spacer />
      <SignInForm
        // processing={processing}
        onSubmit={async (data) => {
          console.log("🚀 ~ file: SignIn.js ~ line 24 ~ onSubmit={ ~ data", data)
        //   setProcessing(true);
        //   const request = await signin(data);
        //   if (request.success) {
        //     setProcessing(false);
        //     if (redirect) {
        //       router.push({
        //         pathname: redirect,
        //         query: redirectQuery || {},
        //       });
        //     }
        //   } else {
        //     setProcessing(false);
        //   }
        }}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
