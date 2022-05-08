import Layout from '../../../components/user/Layout';
import ProfileForm from '../../../components/user/ProfileForm';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as UserContext } from '../../../context/UserContext';
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { Alert } from 'reactstrap';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import api from '../../../utils/api';
import { useRouter } from 'next/router';
import styles from '../../../styles/User.module.scss'

export default function Profile() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    // getProduct()
  }, []);

  return (    
    <div>
        <div>
          <div className="row mt-3 mt-md-0 ms-md-3">
            <div className="col-md-10 section-box">
            <h5 className={'title'}>{t('user.Your Profile')}hihihi key is {key}</h5>
              This is the index route
            </div>
          </div>
        </div>
    </div>
  )
}


export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}