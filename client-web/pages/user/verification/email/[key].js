import { useState, useEffect, useContext } from 'react'
import { Context as AuthContext } from '../../../../context/AuthContext';
import { Context as UserContext } from '../../../../context/UserContext';
import styles from '../../../../styles/Signedin.module.scss'
import Link from 'next/link';
import { Alert, Button } from 'reactstrap';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function VerifyEmail() {
  const { t } = useTranslation('common');
  const {state: { auth }, getAuth, clearErrorMessage: clearAuthErrorMessage } = useContext(AuthContext);
  const { verifyUserEmail, setUserEmailVerification } = useContext(UserContext);
  const [verifiedStatus, setVerifiedStatus] = useState('');
  const [ verificationResentSuccess, setVerificationResentSuccess ] = useState(false);
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    if(auth?.status === 'SIGNED_OUT') {
      router.push({ 
        pathname: '/auth/signin',
        query: {
          redirect: router.asPath
        }
      });
    }
    if(auth?.status === 'SIGNED_IN' && !auth?.user?.isVerified && verifiedStatus === '') {
      setVerifiedStatus('VERIFYING')
      verifyUserEmail({
        id: auth.user._id,
        key
      })
      .then(res => {
        getAuth();
        if(res.verified) {
          setVerifiedStatus('SUCCESS')
        } else {
          setVerifiedStatus('FAILED')
        }      
      });
    }
  }, [auth]);

  return (
    <div className="row mt-3 mt-md-0 ms-md-3">
      {auth?.status === 'SIGNED_IN'
        ? <>
            {auth.user.isVerified
              ? <div className="col-md-8">
                  <h3 color="success" fade={false}>
                    {t(`user.account.verification.Your account has been verified`)}
                  </h3>
                  {t(`user.account.verification.Thanks for verifying your account. What would you like to do next?`)}
                  <div><Link href="/user/profile">{t('user.Manage your profile')}</Link></div>
                  <div><Link href="/">{t('Browse content')}</Link></div>
                </div>
              : null
            }
            {verifiedStatus === 'FAILED'
              ? <div className="col-md-8">
                  <h3 color="danger" fade={false}>
                    {t(`user.account.verification.Your account could not be verified`)}
                  </h3>
                  <div className="mt-4">                    
                    {t('user.account.verification.The link in your email is valid for 24 hours after we send it to you.  If it has been longer than 24 hours, you can request a new email.')}
                  </div>
                  <Button className={'mt-4'} color="primary" onClick={() => {
                    setUserEmailVerification({ id: auth.user._id })
                      .then(res => {
                        if (res.vertificationSetSuccess) {
                          setVerificationResentSuccess(true);
                          setTimeout(() => {
                            setVerificationResentSuccess(false);
                          }, 10000)
                        }
                      })
                  }}>
                    {t('user.account.verification.Send me a new email')}
                  </Button>

                  {verificationResentSuccess
                    ? <Alert className="mt-4" color="success" fade={false}>
                      {t(`user.account.verification.Verification mail re-sent. Check your email for the new link.`)}
                    </Alert>
                    : null
                  }
                </div>
              : null
            }
          </>
        : (auth?.status === 'SIGNED_OUT'
          ? <>
              <Link href="/auth/signin">{t('auth.Sign in')}</Link>
            </>
          : <></>             
        )
      }      
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