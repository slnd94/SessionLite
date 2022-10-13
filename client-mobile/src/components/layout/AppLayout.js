import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Image, Text } from "@rneui/themed";
import React, { useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../../screens/SignIn";

import Spacer from "../Spacer";

const Stack = createNativeStackNavigator();

const AppLayout = ({ children }) => {
  const {
    state: { auth, fileAuth },
    getAuth,
    getFileAuth,
  } = useContext(AuthContext);
  const {
    state: { tenant },
    setTenant,
  } = useContext(TenantContext);

  // get the auth user
  useEffect(() => {
    getAuth();
    // setDisposition();
  }, []);

  // get the user's cart and tenant if signed in
  useEffect(() => {
    if (auth?.status) {
      if (auth.user?.tenant) {
        setTenant({ tenant: auth.user.tenant });
      }

      //   if (auth.status === "SIGNED_IN" && auth.user?.verified) {
      //     getUserCart({ id: auth.user._id });
      //   }

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
          // headerStyle: {
          //   backgroundColor: '#f4511e',
          // },
          // headerTintColor: '#fff',
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          // },
        }}
      >
        {auth?.status ? (
          <>
            {auth?.status === "SIGNED_IN" ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="SignIn" component={SignIn} />
              </>
            )}
          </>
        ) : (
          <Stack.Screen name="Splash" component={SplashScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function HomeScreen() {
  const {
    state: { auth, fileAuth },
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
        <Text h1>Home</Text>
        <View>
          <Text>Status is {auth?.status}</Text>
        </View>
        <View>
          <Text>
            User is {auth?.user ? JSON.stringify(auth.user, null, 2) : null}
          </Text>
        </View>
        <Spacer></Spacer>
        <View>
          <Text>
            FileAuth is {fileAuth ? JSON.stringify(fileAuth, null, 2) : null}
          </Text>
        </View>
        <View>
          <Text>
            Tenant is {tenant ? JSON.stringify(tenant, null, 2) : null}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text h1>Splash</Text>
    </View>
  );
}

export default AppLayout;

const styles = StyleSheet.create({});
