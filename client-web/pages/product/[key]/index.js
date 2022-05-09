import Layout from '../../../components/user/Layout';
import ProfileForm from '../../../components/user/ProfileForm';
import { Context as AuthContext } from '../../../context/AuthContext';
import { Context as UserContext } from '../../../context/UserContext';
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link';
import { Alert } from 'reactstrap';
import { toast } from 'react-toastify';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import api from '../../../utils/api';
import { useRouter } from 'next/router';
import styles from '../../../styles/User.module.scss'

export default function Profile() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { key } = router.query;
  const [ product, setProduct ] = useState(null);
  const [ processing, setProcessing ] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
      
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
    
      // call the function
      fetchProduct()
        // make sure to catch any error
        .catch(console.error);

      // cancel any future `setProduct`
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