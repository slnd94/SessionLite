import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "../../screens/Splash";
import SignIn from "../../screens/SignIn";
import App from "../../screens/App";

const Stack = createNativeStackNavigator();

const AppLayout = ({ children }) => {
  const {
    state: { auth },
    getAuth,
    getFileAuth,
  } = useContext(AuthContext);
  const {
    state: { },
    setTenant,
  } = useContext(TenantContext);

  // get the auth user
  useEffect(() => {
    setTimeout(() => {
      
    getAuth();
    }, 2000);
  }, []);

  // get the user's tenant if signed in
  useEffect(() => {
    if (auth?.status) {
      if (auth.user?.tenant) {
        setTenant({ tenant: auth.user.tenant });
      }

      if (
        auth.status === "SIGNED_OUT" ||
        (auth.status === "SIGNED_IN" && auth?.user?.verified)
      ) {
        // get file auth
        getFileAuth();
      }
    }
  }, [auth]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {auth?.status ? (
          <>
            {auth?.status === "SIGNED_IN" ? (
              <>
                <Stack.Screen name="App" component={App} />
              </>
            ) : (
              <>
                <Stack.Screen name="SignIn" component={SignIn} />
              </>
            )}
          </>
        ) : (
          <Stack.Screen name="Splash" component={Splash} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text h1>Splash</Text>
    </View>
  );
}

export default AppLayout;

const styles = StyleSheet.create({});
