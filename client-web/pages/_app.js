import '../styles/globals.scss'
import '../styles/bootstrap.scss'
import '../styles/components/iconText.scss'
import { Provider as AuthProvider } from '../context/AuthContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp
