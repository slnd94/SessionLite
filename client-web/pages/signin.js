import { useState, useEffect, useContext } from 'react'
import { Alert } from 'reactstrap';
import styles from '../styles/Home.module.scss'
import { Context } from '../context/AuthContext';
import SigninForm from '../components/auth/SigninForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function Signin() {
  const { state: { errorMessage }, signin } = useContext(Context);
  const { t } = useTranslation('common');
  const router = useRouter();
  
  return (
    <>
      <div className="row">
        <div className="col-6">
          {errorMessage
            ? <Alert color="danger">
              {t(`auth.${errorMessage}`)}
            </Alert>
            : null
          }
          <SigninForm 
            onSubmit={async (data) => {
              const request = await signin(data);
              if(request.success) {
                router.push({ pathname: '/signedin' });
              }
            }}
          />
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
