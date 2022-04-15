import Layout from '../../components/user/Layout'
import { Context as AuthContext } from '../../context/AuthContext';
import { useEffect, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Layout.module.scss'

export default function Profile() {
  return (    
    <div>
      <Layout>
        <div>profile content here</div>
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