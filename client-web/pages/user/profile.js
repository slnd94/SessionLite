import Layout from '../../components/user/Layout';
import ProfileForm from '../../components/user/ProfileForm';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { Alert } from 'reactstrap';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import api from '../../utils/api';
import styles from '../../styles/User.module.scss'

export default function Profile() {
  const { t } = useTranslation('common');
  const { state: { auth }, getAuth } = useContext(AuthContext);
  const { state: { errorMessage }, updateUserProfile, clearErrorMessage: clearUserErrorMessage } = useContext(UserContext);
  const [ profile, setProfile ] = useState(null);
  const [ processing, setProcessing ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  useEffect(() => {   
    if (auth?.user) {
      let isSubscribed = true;

      // declare the async data fetching function
      const fetchProfile = async () => {
        const response = await api({ 
          method: 'get',
          url: `${process.env.NEXT_PUBLIC_API_URL}/user-profile/${auth.user._id}`
        });
      
        if (response.status >= 200 && response.status < 300) {
          setProfile(response.data);
          return { success: true };
        } else {
          setProfile(null);
          return { success: false };
        }
      }
    
      // call the function
      fetchProfile()
        // make sure to catch any error
        .catch(console.error);

      // cancel any future `setProfile`
      return () => isSubscribed = false;
    }
  }, [auth]);

  return (    
    <div>
      <Layout>
        <div>
          <div className="row mt-3 mt-md-0 ms-md-3">
            <div className="col-md-8">
            <h5 className={'title'}>{t('user.Your Profile')}</h5>
              {auth?.status === 'SIGNED_IN' && profile
                ? <ProfileForm 
                    processing={processing}
                    defaults={{
                      email: profile.email,
                      firstName: profile.name.given,
                      lastName: profile.name.family
                    }}
                    onSubmit={async (data) => {
                      setProcessing(true);
                      const request = await updateUserProfile({ ...data, id: auth.user._id });
                      if(request.success) {
                        // update the auth context, since user object likely needs update
                        getAuth();
                        // remove processing loader
                        setProcessing(false);
                        // notify user
                        toast(t(`user.User profile updated`), {
                          type: 'success'
                        });
                      } else {
                        // remove preocessing loader
                        setProcessing(false);
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
              {errorMessage?.length
                ? <Alert color="danger" fade={false}>
                  {t(`user.${errorMessage}`)}
                </Alert>
                : null
              }
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