import { useContext } from 'react'
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import styles from '../../styles/User.module.scss'
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ManagementNav from '../layout/ManagementNav';
import { getFullName } from '../../helpers/nameHelpers';

export default function Layout({ children, activeTab}) {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);
  const {state: { cart }} = useContext(UserContext);

  const subRoutes = [
    {
      slug: 'profile',
      icon: 'profile',
      labelPills: t('user.Your Profile'),
      labelTabs: t('Profile')
    },
    {
      slug: 'account',
      icon: 'account',
      labelPills: t('Your Account'),
      labelTabs: t('Account')
    },
    {
      slug: 'cart',
      icon: 'cart',
      labelPills: t('Your Cart'),
      labelTabs: t('Cart'),
      badge: cart.items.length || false
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