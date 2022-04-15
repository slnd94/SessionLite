import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  return (
    <>
      <h1 className="title">
        {t('index.Welcome to the application')}  
      </h1>

      <p>
        {auth?.status === 'SIGNED_IN'
          ? <span>Hi, {auth.user.name.given}</span>
          : (auth?.status === 'SIGNED_OUT'
            ? <>
                <Link href="/signin">{t('auth.Sign in')}</Link> <br />
                <Link href="/signup">{t('auth.Sign up')}</Link>
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