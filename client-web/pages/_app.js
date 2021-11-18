import '../styles/globals.scss'
import '../styles/bootstrap.scss'
import '../styles/components/iconText.scss'
import { appWithTranslation } from 'next-i18next';
import { Provider as AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';

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
