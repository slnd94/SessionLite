import Layout from '../../components/user/Layout';
import ProfileForm from '../../components/user/ProfileForm';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useState, useContext } from 'react'
import Link from 'next/link';
import { Alert } from 'reactstrap';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/User.module.scss'

export default function Profile() {
  const { t } = useTranslation('common');
  const { state: { auth }, getAuth } = useContext(AuthContext);
  const { state: { }, updateUserProfile } = useContext(UserContext);
  const [ processing, setProcessing ] = useState(false);
  const [ success, setSuccess ] = useState(false);

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
                  setProcessing(true);
                  const request = await updateUserProfile({ ...data, id: auth.user._id });
                  if(request.success) {
                    getAuth();
                    setProcessing(false);
                    setSuccess(true);
                    setTimeout(() => {
                      setSuccess(false);
                   }, 3000)
                  } else {
                    setProcessing(false);
                    setSuccess(false);
                  }
                }}
              />
            : (auth?.status === 'SIGNED_OUT'
              ? <>
                  <Link href="/auth/signin">{t('auth.Sign in')}</Link>
                </>
              : <></>             
            )
          }
          {success
            ? <Alert color="success" fade={false}>
              {t(`user.User profile updated`)}
            </Alert>
            : null
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