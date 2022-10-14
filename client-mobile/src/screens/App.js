import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import Home from "./Home";
import Schedule from "./Schedule";
import SessionLiteLogoSvg from "../components/svg/SessionLiteLogoSvg";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
      <View style={styles.appContainer}>
        <View style={styles.header}>
          {/* <SessionLiteSvg scale={0.3} /> */}
        <SessionLiteLogoSvg scale={0.3} />
        </View>
        <StatusBar style="auto" />
        <View style={styles.container}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Schedule" component={Schedule} />
          </Tab.Navigator>
        </View>
      </View>
  );
};

export default App;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff",
    alignItems: "stretch",
    justifyContent: "flex-start",
    // padding: 16,
    // backgroundColor: "#f7f7f7",
  },
  header: {
    // flex: 1,
    padding: 20,
    // paddingTop: 0,
    paddingTop: 45,
    paddingBottom: 16,
    // height: 100,
    backgroundColor: "#f7f7f7",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    alignItems: "center"
  },
  container: {
    flex: 1,
    // paddingTop: 10,
    // paddingHorizontal: 10,
    display: "flex",
    justifyContent: "space-between",
    // alignItems: "stretch",
    // backgroundColor: "#9365b8"
  },
});
