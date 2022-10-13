import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemeProvider, createTheme } from "@rneui/themed";

import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as UserProvider } from "./src/context/UserContext";
import { Provider as TenantProvider } from "./src/context/TenantContext";

import AppLayout from "./src/components/layout/AppLayout";

import elementsTheme from "./src/styles/elementsTheme";

import "./i18n.config";

const theme = createTheme(elementsTheme);

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <TenantProvider>
          <ThemeProvider theme={theme}>
            <AppLayout />
          </ThemeProvider>
        </TenantProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
