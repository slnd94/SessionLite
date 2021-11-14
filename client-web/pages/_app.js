import '../styles/globals.scss'
import '../styles/bootstrap.scss'
// import 'bootstrap/dist/css/bootstrap.css';
import { Provider as AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
