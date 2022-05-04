import { useState, useEffect, useContext } from 'react'
import { Alert } from 'reactstrap';
import styles from '../../styles/Signup.module.scss'
import { Context as AuthContext } from '../../context/AuthContext';
import SignUpForm from '../../components/auth/SignUpForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const { state: { auth, errorMessage }, signup, clearErrorMessage: clearAuthErrorMessage } = useContext(AuthContext);
  const [ processing, setProcessing ] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    clearAuthErrorMessage();
  }, []);
  
  return (
    <>
      {auth?.status === 'SIGNED_OUT'
        ? <div className="row">
            <div className="col-12 col-sm-6">
              {errorMessage
                ? <Alert color="danger">
                  {t(`auth.There was a problem with your sign in`)}
                </Alert>
                : null
              }
              <SignUpForm
                processing={processing}
                onSubmit={async (data) => {
                  setProcessing(true);
                  const request = await signup(data);
                  setProcessing(false);
                }}
              />
              <div style={{marginTop: '10px'}}>
                <span style={{marginRight: '10px'}}>{t(`auth.Already have an account?`)}</span>
                <Link href="/auth/signin">{t('auth.Sign in')}</Link>
              </div>
            </div>
            <div className="col-sm-6 d-none d-sm-block">
              Branded image/artwork here
            </div>
          </div>
        : <></>
      }
      {auth?.status === 'SIGNED_IN'
        ? <>
            <h4 className="title">
              {t('auth.Thanks for signing up')}   
            </h4>
            {!auth.user.isVerified
              ? <p>
                {t('user.account.verification.We will need to verify your account. You should receive an email with a verification link.')}
              </p>
              : <>
                <h6>
                  {t(`auth.What's next?`)}
                </h6>
                <p>
                  <Link href="/user/profile">                
                    {t('user.Manage your profile')}      
                  </Link><br />
                  <Link href="/">                
                    {t('Browse content')}          
                  </Link>
                </p>
              </>
            }            
          </>
        : <></>
      }



      
      
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
