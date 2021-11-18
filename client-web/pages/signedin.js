import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignedIn() {
  const { t } = useTranslation('common');
  const {state: { user: authUser }} = useContext(AuthContext);

  return (
    <>
      <h1 className={styles.title}>
        {t('auth.You have successfully signed in')}  
      </h1>

      <p className={styles.description}>
        {authUser
          ? <div>Hi, {authUser.name.given}</div>
          : <Link href="/signin">{t('auth.Sign in')}</Link>
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