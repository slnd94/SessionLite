import App from "next/app";
import "../styles/globals.scss";
import { appWithTranslation } from "next-i18next";
import { Provider as AuthProvider } from "../context/AuthContext";
import { Provider as UserProvider } from "../context/UserContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <UserProvider>
        <Layout brandName="Traverston">
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
