import App from "next/app";
import "../styles/globals.scss";
import { appWithTranslation } from "next-i18next";
import { Provider as AuthProvider } from "../context/AuthContext";
import { Provider as UserProvider } from "../context/UserContext";
import { Provider as ClientProvider } from "../context/ClientContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <ClientProvider>
          <Layout brandName="Hello Brand">
            <Component {...pageProps} />
          </Layout>
        </ClientProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
