import Layout from '../../components/user/Layout'
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router';
import UserCart from '../../components/user/UserCart';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Button } from 'reactstrap';
import styles from '../../styles/User.module.scss'

export default function Cart() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { state: { auth } } = useContext(AuthContext);
  const { state: { cart }, getUserCart, clearErrorMessage: clearUserErrorMessage } = useContext(UserContext);


  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <div>
      <Layout>
        <div>
          <div className="row mt-3 mt-md-0 mb-3 ms-md-3">
            {cart?.items.length && auth?.status
              ? <div className="col-md-10 section-box">
                  <h5 className={'title'}>{t('user.cart.Your Cart')}</h5>  
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
                  <Button
                    // size='lg'
                    className={'me-4 btn-block-md-down'}
                    color="success"
                    onClick={() => {
                      router.push({ 
                        pathname: `/checkout`
                      });
                    }}
                  >
                    {t('user.cart.Proceed to checkout')}
                  </Button>
                </div>
              : <h5 className={'title'}>{t('user.cart.Your cart is empty')}</h5>     
            }
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