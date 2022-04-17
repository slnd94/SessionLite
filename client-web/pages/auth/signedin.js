import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../../context/AuthContext';
import styles from '../../styles/Signedin.module.scss'
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignedIn() {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  return (
    <>
      <h1 className="title">
        {t('auth.You have successfully signed in')}  
      </h1>

      <p>
        {auth?.status === 'SIGNED_IN'
          ? <>
              <div>Hi, {auth.user.name.given}</div>
              <div><Link href="/user/profile">{t('auth.Your profile')}</Link></div>
            </>
          : (auth?.status === 'SIGNED_OUT'
            ? <>
                <Link href="/auth/signin">{t('auth.Sign in')}</Link>
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