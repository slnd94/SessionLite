import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { Provider as UserProvider } from "./src/context/UserContext";
import { Provider as TenantProvider } from "./src/context/TenantContext";
import Layout from './src/components/layout/Layout';

const App = () => {
  return (  
    <AuthProvider>
      <UserProvider>
        <TenantProvider>
          <Layout />
        </TenantProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App

const styles = StyleSheet.create({})