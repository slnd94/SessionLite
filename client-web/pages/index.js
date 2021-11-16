import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.scss'
import api from '../utils/api';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
      <h1 className={styles.title}>
        {t('index.Welcome to the application')}  
      </h1>

      <p className={styles.description}>
        <Link href="/signin">Sign in</Link>
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