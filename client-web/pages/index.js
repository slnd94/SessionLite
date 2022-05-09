import { useEffect, useState, useContext } from 'react'
import { Context as AuthContext } from '../context/AuthContext';
import styles from '../styles/Home.module.scss'
import Link from 'next/link';
import PaginatedList from '../components/PaginatedList';
import ProductListItem from '../components/product/ProductListItem';
import api from '../utils/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation('common');
  const {state: { auth }} = useContext(AuthContext);
  const [ products, setProducts ] = useState(null);
  const [ requestingProducts, setRequestingProducts ] = useState(false);

  const fetchProducts = async () => {
    setRequestingProducts(true)
    const response = await api({ 
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_API_URL}/products`
    });
  
    if (response.status >= 200 && response.status < 300) {
      setProducts(response.data);
      setRequestingProducts(false)
      return { success: true };
    } else {
      setProducts(null);
      setRequestingProducts(false)
      return { success: false };
    }
  }

  useEffect(() => {
    let isSubscribed = true;
      fetchProducts()
        .catch(console.error);
      return () => isSubscribed = false;
  }, []);  

  return (
    <>
      <h1 className="title">
        {t('index.Welcome to')}&nbsp;{process.env.NEXT_APP_NAME}
      </h1>

      {auth?.status === 'SIGNED_OUT'
        ? <div>
            <Link href="/auth/signin">{t('auth.Sign in')}</Link><br />
            <Link href="/auth/signup">{t('auth.Sign up')}</Link>
          </div>
        : <></>             
      }
      {products
        ? <>
            <PaginatedList
              items={products.data}
              itemComponent={ProductListItem}
              itemPropName={'product'}
              itemsListedName={t('product.products')}
              itemsPerPage={5}
              showPaginationTop
              showPaginationBottom
              hidePaginationForSinglePage
              requestingItems={requestingProducts}
              itemNavRoute={'/product'}
              showLink={true}
              // onRef={ref => (this.paginatedList = ref)}
            />
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