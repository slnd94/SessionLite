import { useState, useEffect, useContext } from 'react'
import { Alert } from 'reactstrap';
import styles from '../styles/Home.module.scss'
import { Context } from '../context/AuthContext';
import SigninForm from '../components/SigninForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function SignedOut() {

  const { t } = useTranslation('common');
  
  return (
    <>
      <div className="row">
        <div className="col-6">
          You have signed out
        </div>
        <div className="col-6">
          
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
