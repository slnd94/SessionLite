import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TenantContext } from "../context/TenantContext";
import { useTranslation } from "react-i18next";

import Spacer from "../components/Spacer";
import Button from "../components/Button";

const Home = () => {
  const {
    state: { auth, fileAuth },
    signout,
  } = useContext(AuthContext);
  const {
    state: { tenant },
  } = useContext(TenantContext);

  const { t } = useTranslation();

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <Text h1>Home</Text>
        <View>
          <Text>Welcome, {auth?.user?.name.given}</Text>
        </View>
      </View>
      <Button
        title={t("auth.Sign out")}
        color="primary"
        onPress={() => {
          signout();
        }}
      />
      <Spacer />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
