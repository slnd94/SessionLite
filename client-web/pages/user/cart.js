import Layout from '../../components/user/Layout'
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useEffect, useContext, useState } from 'react'
import PaginatedList from '../../components/PaginatedList';
import UserCartItem from '../../components/user/UserCartItem';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/User.module.scss'

export default function Cart() {
  const { t } = useTranslation('common');
  const { state: { auth } } = useContext(AuthContext);
  const { state: { cart }, getUserCart, clearErrorMessage: clearUserErrorMessage } = useContext(UserContext);
  const [ checkout, setCheckout ] = useState(false);


  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <div>
      <Layout>
        <div>
          <div className="row mt-3 mt-md-0 ms-md-3">
            {cart?.items.length
              ? <div className="col-md-10 section-box">
                  <h5 className={'title'}>{t('user.Your Cart')}</h5>
                  <PaginatedList
                    items={cart?.items.length ? cart.items.map(item => item.product) : []}
                    itemComponent={UserCartItem}
                    itemComponentCustomProps={{
                      removeFromCartFunc: checkout ? null : async productId => {
                        if(auth?.status === 'SIGNED_IN') {
                          const response = await api({
                            method: 'patch',
                            url: `${process.env.NEXT_PUBLIC_API_URL}/user-carts/${auth.user._id}`,
                            params: {
                              removeProduct: productId
                            }
                          });
                          if (response.status >= 200 && response.status < 300 && response.data.success) {
                            getUserCart({ id: auth.user._id });
                            toast(t(`user.Removed from cart`), {
                              type: 'info'
                            });
                          }
                        }
                      },
                      t
                    }}
                    itemPropName={'product'}
                    itemsListedName={t('product.products')}
                    itemsPerPage={5}
                    showPaginationTop
                    showPaginationBottom
                    hidePaginationForSinglePage
                    itemNavRoute={'/product'}
                    showLink={true}
                    t={t}
                    // onRef={ref => (this.paginatedList = ref)}
                  />
                </div>
              : <h5 className={'title'}>{t('user.Your cart is empty')}</h5>     
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