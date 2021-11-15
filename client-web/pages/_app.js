import '../styles/globals.scss'
import '../styles/bootstrap.scss'
// import 'bootstrap/dist/css/bootstrap.css';
import { Provider as AuthProvider } from '../context/AuthContext';
import Layout from '../components/layout';

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
