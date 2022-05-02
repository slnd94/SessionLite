import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../../context/AuthContext';
import styles from '../../styles/Signedin.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignOut() {
  const { t } = useTranslation('common');
  const {state: { auth }, signout, clearErrorMessage: clearAuthErrorMessage } = useContext(AuthContext);

  useEffect(() => {
    clearAuthErrorMessage();
    signout()
  }, []);

  return (
    <>
      <h1 className="title">
        {t('auth.You have successfully signed out')}  
      </h1>

      <p>
        {auth?.status === 'SIGNED_IN'
          ? <></>
          : (auth?.status === 'SIGNED_OUT'
            ? <>
                <Link href="/auth/signin">{t('auth.Sign in')}</Link><br />
                <Link href="/auth/signup">{t('auth.Sign up')}</Link>
              </>
            : <></>             
          )
        }
      </p>
      
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