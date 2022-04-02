import { useState, useEffect, useContext } from 'react'
import { Alert } from 'reactstrap';
import styles from '../styles/Home.module.scss'
import { Context } from '../context/AuthContext';
import SignUpForm from '../components/auth/SignUpForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const { state: { errorMessage }, signup } = useContext(Context);
  const [ processing, setProcessing ] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();
  
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
          <SignUpForm 
            processing={processing}
            onSubmit={async (data) => {
              setProcessing(true);
              const request = await signup(data);
              if(request.success) {
                router.push({ pathname: '/signedin' });
              } else {
                setProcessing(false);
              }
            }}
          />
          <div style={{marginTop: '10px'}}>
            <span style={{marginRight: '10px'}}>{t(`auth.Already have an account?`)}</span>
            <Link href="/signin">{t('auth.Sign in')}</Link>
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
