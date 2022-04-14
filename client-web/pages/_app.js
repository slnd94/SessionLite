import App from "next/app";
import '../styles/bootstrap.scss'
import '../styles/globals.scss'
import { appWithTranslation } from 'next-i18next';
import { Provider as AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout brandName="Hello Brand">
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default appWithTranslation(MyApp)
