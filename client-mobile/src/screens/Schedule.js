import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as TenantContext } from "../context/TenantContext";

import Spacer from "../components/Spacer";

const Schedule = () => {
  const {
    state: { auth, fileAuth },
    signout,
  } = useContext(AuthContext);
  const {
    state: { tenant },
  } = useContext(TenantContext);
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
        <Text h1>Schedule</Text>
      </View>
    </ScrollView>
  );
};

export default Schedule;

const styles = StyleSheet.create({});
