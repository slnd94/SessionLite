import Layout from '../../components/user/Layout'
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as UserContext } from '../../context/UserContext';
import { useEffect, useContext, useState } from 'react'
import PaginatedList from '../../components/PaginatedList';
import UserCartItem from '../../components/user/UserCartItem';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import styles from '../../styles/User.module.scss'

export default function Cart() {
  const { t } = useTranslation('common');
  const { state: { cart }, removeProductFromCart, clearErrorMessage: clearUserErrorMessage } = useContext(UserContext);
  const [ checkout, setCheckout ] = useState(false);
  const [ requestingCart, setRequestingCart ] = useState(false);


  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <div>
      <Layout>
        <div>
          <div className="row mt-3 mt-md-0 ms-md-3">
            <div className="col-md-10 section-box">
              <h5 className={'title'}>{t('user.Your Cart')}</h5>
              <PaginatedList
                items={cart?.items.length ? cart.items.map(item => item.product) : []}
                itemComponent={UserCartItem}
                itemComponentCustomProps={{
                  removeFromCartFunc: checkout ? null : productId => ({})
                }}
                itemPropName={'product'}
                itemsListedName={t('product.products')}
                itemsPerPage={5}
                showPaginationTop
                showPaginationBottom
                hidePaginationForSinglePage
                requestingItems={requestingCart}
                itemNavRoute={'/product'}
                showLink={true}
                // onRef={ref => (this.paginatedList = ref)}
              />
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