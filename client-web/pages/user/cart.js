import Layout from '../../components/user/Layout'
import { Context as AuthContext } from '../../context/AuthContext';
import { useEffect, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/Layout.module.scss'

export default function Cart() {
  const { t } = useTranslation('common');

  return (    
    <div>
      <Layout>
        <div>
          <div className="row mt-3 mt-md-0 ms-0 ms-md-3">
            <div className="col-md-8">
              <h5 className={'title'}>{t('user.Your Cart')}</h5>
            </div>
          </div>
        </div>
      </Layout>
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