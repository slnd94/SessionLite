import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../../../context/AuthContext';
import styles from '../../../styles/Signedin.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function VerifyEmail() {
  const { t } = useTranslation('common');
  const {state: { auth }, clearErrorMessage: clearAuthErrorMessage } = useContext(AuthContext);
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    if(auth?.status === 'SIGNED_OUT') {
      router.push({ 
        pathname: '/auth/signin',
        query: {
          redirect: router.asPath
        }
      });
    }
  }, [auth]);

  return (
    <>
      <h1 className="title">
        {t('auth.Verify')}  
      </h1>
      {auth?.status === 'SIGNED_IN'
        ? <>
            <div>Hi, {auth.user.name.given}</div>
            <div>Your key is: {key}</div>
            <div><Link href="/user/profile">{t('auth.Your profile')}</Link></div>
          </>
        : (auth?.status === 'SIGNED_OUT'
          ? <>
              <Link href="/auth/signin">{t('auth.Sign in')}</Link>
            </>
          : <></>             
        )
      }      
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