import App from "next/app";
import "../styles/globals.scss";
import { appWithTranslation } from "next-i18next";

import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import { Provider as AuthProvider } from "../context/AuthContext";
import { Provider as UserProvider } from "../context/UserContext";
import { Provider as TenantProvider } from "../context/TenantContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  if (process.env.NODE_ENV === 'production') {
    // don't show react dev tools
    disableReactDevTools();
  }

  return (
    <AuthProvider>
      <UserProvider>
        <TenantProvider>
          <Layout brandName="Traverston">
            <Component {...pageProps} />
          </Layout>
        </TenantProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
