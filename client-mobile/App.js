import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as UserProvider } from "./src/context/UserContext";
import { Provider as TenantProvider } from "./src/context/TenantContext";
import AppLayout from './src/components/layout/AppLayout';

const App = () => {
  return (  
    <AuthProvider>
      <UserProvider>
        <TenantProvider>
          <AppLayout />
        </TenantProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App

const styles = StyleSheet.create({})