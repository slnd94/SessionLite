import Layout from '../../components/user/Layout';
import ProfileForm from '../../components/user/ProfileForm';
import { Context as AuthContext } from '../../context/AuthContext';
import { useEffect, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Layout.module.scss'

export default function Profile() {
  const {state: { auth }} = useContext(AuthContext);
  return (    
    <div>
      <Layout>
        <div>
          {auth?.status === 'SIGNED_IN'
            ? <ProfileForm 
                processing={false}
                defaults={{
                  email: auth.user.email,
                  firstName: auth.user.name.given,
                  lastName: auth.user.name.family
                }}
                onSubmit={async (data) => {
                  console.log("🚀 ~ file: profile.js ~ line 24 ~ onSubmit={ ~ data", data)
                  // setProcessing(true);
                  // const request = await signup(data);
                  // if(request.success) {
                  //   router.push({ pathname: '/signedin' });
                  // } else {
                  //   setProcessing(false);
                  // }
                }}
              />
            : (auth?.status === 'SIGNED_OUT'
              ? <>
                  <Link href="/signin">{t('auth.Sign in')}</Link>
                </>
              : <></>             
            )
          }
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