import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignedOut() {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  return (
    <>
      <h1 className={styles.title}>
        {t('auth.You have successfully signed out')}  
      </h1>

      <p className={styles.description}>
        {auth?.status === 'SIGNED_IN'
          ? <span>Hi, {auth.user.name.given}</span>
          : (auth?.status === 'SIGNED_OUT'
            ? <>
                <Link href="/signin">{t('auth.Sign in')}</Link>
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