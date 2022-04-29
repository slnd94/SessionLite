import { useState, useEffect, useContext } from 'react'
import { Alert } from 'reactstrap';
import styles from '../../styles/Signin.module.scss'
import { Context as AuthContext } from '../../context/AuthContext';
import SignInForm from '../../components/auth/SignInForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signin() {
  const { state: { errorMessage }, signin, clearErrorMessage: clearAuthErrorMessage } = useContext(AuthContext);
  const [ processing, setProcessing ] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();
  const { redirect, redirectQuery } = router.query;

  useEffect(() => {
    clearAuthErrorMessage();
  }, []);
  
  return (
    <>
      <div className="row">
        <div className="col-12 col-sm-6">
          {errorMessage
            ? <Alert color="danger">
              {t(`auth.There was a problem with your sign in`)}
            </Alert>
            : null
          }
          <SignInForm 
            processing={processing}
            onSubmit={async (data) => {
              setProcessing(true);
              const request = await signin(data);
              if(request.success) {
                if (redirect) {
                  router.push({ pathname: redirect, query: redirectQuery || {} });
                } else {
                  router.push({ pathname: '/auth/signedin' });
                }                
              } else {
                setProcessing(false);
              }
            }}
          />
          <div style={{marginTop: '10px'}}>
            <span style={{marginRight: '10px'}}>{t(`auth.Need an account?`)}</span>
            <Link href="/auth/signup">{t('auth.Sign up')}</Link>
          </div>
        </div>
        <div className="col-sm-6 d-none d-sm-block">
          Branded image/artwork here
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}
