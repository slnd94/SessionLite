// import Layout from '../components/user/Layout'
import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';
import { useEffect, useContext, useState } from 'react'
import UserCart from '../components/user/UserCart';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styles from '../styles/Checkout.module.scss'

export default function Checkout() {
  const { t } = useTranslation('common');
  const { state: { auth } } = useContext(AuthContext);
  const { state: { cart }, getUserCart, clearErrorMessage: clearUserErrorMessage } = useContext(UserContext);
  const [ checkout, setCheckout ] = useState(false);


  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <>
      <div className="row mt-3 mt-md-0">
        {cart?.items.length
          ? <div className="col-12">
              <h5 className={'title'}>{t('user.cart.Details')}</h5>
              <UserCart
                cart={cart}
                auth={auth}
                onRemoveItem={() => {
                  getUserCart({ id: auth.user._id });
                  toast(t(`user.cart.Removed from cart`), {
                    type: 'info'
                  });
                }}
                t={t}
              />
            </div>
          : <h5 className={'title'}>{t('user.cart.Your cart is empty')}</h5>     
        }
      </div>
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