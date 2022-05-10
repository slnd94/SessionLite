import Layout from '../../../components/user/Layout';
import ProfileForm from '../../../components/user/ProfileForm';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as UserContext } from '../../../context/UserContext';
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import ProductUserCart from '../../../components/product/ProductUserCart';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import api from '../../../utils/api';
import { useRouter } from 'next/router';
import styles from '../../../styles/User.module.scss'

export default function Profile() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { key } = router.query;
  const { getUserCart } = useContext(UserContext);
  const { state: { auth } } = useContext(AuthContext);
  const [ userCurrencyCode, setUserCurrencyCode ] = useState(process.env.DEFAULT_CURRENCY);
  const [ product, setProduct ] = useState(null);
  const [ processing, setProcessing ] = useState(false);

  const fetchProduct = async () => {
    const response = await api({ 
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_API_URL}/products/${key}`
    });
  
    if (response.status >= 200 && response.status < 300) {
      setProduct(response.data);
      return { success: true };
    } else {
      setProduct(null);
      return { success: false };
    }
  }

  useEffect(() => {
    let isSubscribed = true;
      fetchProduct()
        .catch(console.error);
      return () => isSubscribed = false;
  }, []);  

  return (    
    <>
      {product
        ? <div>
            <div className="row mt-3">
              <div className="col-md-12 section-box">
                <h5 className={'title'}>{product.name}</h5>
                <p>{product.description}</p>
                <ul>
                  {product.features.map((feature, index) =>{
                    return <li key={index}>{feature}</li>
                  })}
                </ul>
                <ProductUserCart
                  productId={product._id}
                  inUserCart={product.inUserCart}
                  price={{ figure: product.prices[userCurrencyCode], currencyCode: userCurrencyCode }}
                  authUser={auth?.status === 'SIGNED_IN'}
                  processing={processing}
                  addToCartFunc={async () => {
                    setProcessing(true);
                    if(auth?.status === 'SIGNED_IN') {
                      const response = await api({
                        method: 'patch',
                        url: `${process.env.NEXT_PUBLIC_API_URL}/user-carts/${auth.user._id}`,
                        params: {
                          addProduct: key
                        }
                      });
                      if (response.status >= 200 && response.status < 300 && response.data.success) {
                        getUserCart({ id: auth.user._id });
                        await fetchProduct()
                        setProcessing(false);
                        // notify user
                        toast(t(`user.Added to cart`), {
                          type: 'success'
                        });
                      }
                    }
                  }}
                  removeFromCartFunc={async () => {
                    setProcessing(true);
                    if(auth?.status === 'SIGNED_IN') {
                      const response = await api({
                        method: 'patch',
                        url: `${process.env.NEXT_PUBLIC_API_URL}/user-carts/${auth.user._id}`,
                        params: {
                          removeProduct: key
                        }
                      });
                      if (response.status >= 200 && response.status < 300 && response.data.success) {
                        getUserCart({ id: auth.user._id });
                        await fetchProduct()
                        setProcessing(false);
                        // notify user
                        toast(t(`user.Removed from cart`), {
                          type: 'info'
                        });
                      }
                    }
                  }}
                  userProductStatus={{
                    authUserAdmin: product.authUserAdmin,
                    authUserPurchased: product.authUserPurchased
                  }}
                  t={t}
                />
              </div>
            </div>
          </div>
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