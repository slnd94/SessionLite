import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TenantContext } from "../context/TenantContext";
import useTenantUserAuth from "../hooks/useTenantUserAuth";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { REACT_APP_API_BASE_URL } from "@env";
import { getFormattedDateTimeLong } from "../helpers/dateHelpers";

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

  const [userSessions, setUserSessions] = useState(null);
  const [requestingUserSessions, setRequestingUserSessions] = useState(false);
  const userSessionsPerPage = 2;

  const fetchUserSessions = async ({ skip, limit }) => {
    setRequestingUserSessions(true);
    const response = await api({
      method: "get",
      url: `${REACT_APP_API_BASE_URL}/tenant-sessions`,
      params: {
        tenant: tenant._id,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setRequestingUserSessions(false);
      return { success: true, data: response.data };
    } else {
      setRequestingUserSessions(false);
      return { success: false };
    }
  };

  useEffect(() => {
    if (tenant && auth?.status === "SIGNED_IN") {
      const { isMember } = useTenantUserAuth({
        tenant,
        auth,
      });
      if (isMember) {
        let isSubscribed = true;
        fetchUserSessions({ skip: 0, limit: userSessionsPerPage })
          .then((response) => {
            if (isSubscribed) {
              if (response.success) {
                setUserSessions(response.data);
              } else {
                setUserSessions(null);
              }
            }
          })
          .catch(console.error);
        return () => (isSubscribed = false);
      }
    }
  }, [tenant, auth]);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={{
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
        contentContainerStyle={{
          justifyContent: "space-between",
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
              <Text h2>Home</Text>
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
              <Text h4>
                Welcome, {auth?.user?.name.given} {auth?.user?.name.family}
              </Text>
            </View>
            {/* <Text>Auth is {auth ? JSON.stringify(auth, null, 2) : null}</Text> */}
          </View>
        </View>
        <Spacer />
        <View>
          {userSessions ? (
            <>
              {userSessions.data.map((session) => (
                <View key={session._id} style={{ marginVertical: 20 }}>
                  <View className="col-12">
                    <Text h5>{session.name}</Text>
                  </View>
                  <View className="col-12">
                    <Text>{session.description}</Text>
                  </View>
                  <View className="col-12">
                    <Text>{getFormattedDateTimeLong(session.start)}</Text>
                  </View>
                </View>
              ))}
            </>
          ) : null}
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
