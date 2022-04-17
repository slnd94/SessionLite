import { useContext } from 'react'
import { Context as AuthContext } from '../../context/AuthContext';
import styles from '../../styles/User.module.scss'
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ManagementNav from '../layout/ManagementNav';
import { getFullName } from '../../helpers/nameHelpers';

export default function Layout({ children, activeTab}) {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);

  const subRoutes = [
    {
      slug: 'profile',
      icon: 'profile',
      label: 'Profile'
    },
    {
      slug: 'account',
      icon: 'account',
      label: 'Account'
    },
    {
      slug: 'cart',
      icon: 'cart',
      label: 'Cart'
    }
  ];

  return (
    <>
      {auth?.status === 'SIGNED_IN'
        ? <>
            <h1 className="title">
              {getFullName(auth.user.name)}
            </h1>
            <div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <ManagementNav prefix="user" subRoutes={subRoutes} />
                </div>
                <div className="col-md-9">
                  {children}
                </div>
              </div>
            </div>
          </>
        : (auth?.status === 'SIGNED_OUT'
          ? <>
              <Link href="/auth/signin">{t('auth.Sign in')}</Link>
            </>
          : <></>             
        )
      }
    </>
  )
}