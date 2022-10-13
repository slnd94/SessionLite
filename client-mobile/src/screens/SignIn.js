import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";

const SignIn = ({ navigation }) => {
    const {
      state: { auth, fileAuth },
      getAuth,
      getFileAuth,
    } = useContext(AuthContext);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text h1>Sign In</Text>
      <Text>Status is {auth?.status}</Text>
      
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({})