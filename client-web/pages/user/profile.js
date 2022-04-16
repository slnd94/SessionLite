import Layout from '../../components/user/Layout';
import ProfileForm from '../../components/user/ProfileForm';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useEffect, useState, useContext } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/User.module.scss'

export default function Profile() {
  const {state: { auth }} = useContext(AuthContext);
  const {state: { }, updateUserProfile} = useContext(UserContext);
  const [ processing, setProcessing ] = useState(false);

  return (    
    <div>
      <Layout>
        <div>
          {auth?.status === 'SIGNED_IN'
            ? <ProfileForm 
                processing={processing}
                defaults={{
                  email: auth.user.email,
                  firstName: auth.user.name.given,
                  lastName: auth.user.name.family
                }}
                onSubmit={async (data) => {
                  console.log("🚀 ~ file: profile.js ~ line 24 ~ onSubmit={ ~ data", data)
                  setProcessing(true);
                  const request = await updateUserProfile({ ...data, id: auth.user._id });
                  if(request.success) {
                    setProcessing(false);
                  } else {
                    setProcessing(false);
                  }
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