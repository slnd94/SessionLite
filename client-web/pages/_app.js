import App from "next/app";
import "../styles/globals.scss";
import { appWithTranslation } from "next-i18next";
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import { Provider as AuthProvider } from "../context/AuthContext";
import { Provider as UserProvider } from "../context/UserContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  // const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

  return (
    <AuthProvider>
      <UserProvider>
        {/* <Elements stripe={stripePromise}> */}
        <Layout brandName="Hello Brand">
          <Component {...pageProps} />
        </Layout>
        {/* </Elements> */}
      </UserProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
