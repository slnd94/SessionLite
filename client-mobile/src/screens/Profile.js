import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TenantContext } from "../context/TenantContext";
import { useTranslation } from "react-i18next";
import { screen } from "../styles/global";

import Spacer from "../components/Spacer";
import Button from "../components/Button";
import TenantLogo from "../components/tenant/TenantLogo";

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
    <View style={styles.screen}>
      <ScrollView
        style={{
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
      >
        <View
          style={{
            flex: 1,
            // alignItems: "stretch",
            justifyContent: "space-between",
            // paddingHorizontal: 20,
            // paddingVertical: 40,
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              // display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text h2>Profile</Text>
            </View>
            <View>
              {tenant?.logo?.handle && fileAuth?.viewTenantLogo ? (
                <TenantLogo
                  handle={tenant.logo.handle}
                  size="xs"
                  viewFileAuth={fileAuth?.viewTenantLogo}
                />
              ) : null}
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View>
              <Text h4>Welcome, {auth?.user?.name.given} {auth?.user?.name.family}</Text>
            </View>
            {/* <Text>Auth is {auth ? JSON.stringify(auth, null, 2) : null}</Text> */}
          </View>
        </View>
        <Spacer />
        <View
          style={{
            flex: 1,
            alignItems: "stretch",
            justifyContent: "center",
          }}
        >
          <Button
            title={t("auth.Sign out")}
            color="primary"
            onPress={() => {
              signout();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen,
});
