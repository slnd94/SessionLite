import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Home from "./Home";
import Schedule from "./Schedule";
import Profile from "./Profile";
import Settings from "./Settings";
import AppLogoSvg from "../components/svg/AppLogoSvg";
import { colors } from "../styles/variables";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        {/* <SessionLiteSvg scale={0.3} /> */}
        <AppLogoSvg scale={0.25} />
      </View>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Schedule") {
                iconName = "calendar";
              } else if (route.name === "Profile") {
                iconName = "user";
              } else if (route.name === "Settings") {
                iconName = "cog";
              }

              // You can return any component that you like here!\
              return <FontAwesome5 name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            // tabBarInactiveTintColor: colors.light,
            tabBarStyle: {
              backgroundColor: colors.lightest,
              borderTopWidth: 1,
              borderTopColor: colors.lighter,
              // paddingTop: 20
              // marginTop: 20
            },
            // tabBarInactiveBackgroundColor: colors.lightest,
            // tabBarActiveBackgroundColor: colors.white
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Schedule" component={Schedule} />
          <Tab.Screen name="Profile" component={Profile} />
          <Tab.Screen name="Settings" component={Settings} />
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
    alignItems: "center",
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
