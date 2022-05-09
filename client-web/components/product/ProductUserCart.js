import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Amount from '../commerce/Amount';
import { Button, Alert } from 'reactstrap';
import Loader from '../Loader';
import Link from 'next/link';
import IconText from '../IconText';

const ProductUserCart = ({ inUserCart, price, userProductStatus, authUser, addToCartFunc, requestingAddProductToCart, removeFromCartFunc, requestingRemoveProductFromCart, processing, t }) => {
  const router = useRouter();
  
  return (
    <>
      <div className="row">
        <div className="col-sm-3">
          <Amount amount={price} className="mr-4" style={{ fontSize: '2rem' }} t={t} />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-sm-8">
          {processing
            ? <Loader />
            : (!(userProductStatus.authUserAdmin || userProductStatus.authUserPurchased) &&
              <div>
                {inUserCart &&
                  <>
                    <Alert color="info" fade={false}>
                      {t('user.This product is in your cart')}
                    </Alert>
                    <div className="mt-4">
                      <Button
                        size='lg'
                        className={'me-4 btn-block-sm-down'}
                        color="primary"
                        onClick={() => {
                          router.push({ 
                            pathname: `/user/cart`
                          });
                        }}
                      >
                        {t('user.View your cart')}
                      </Button>
                      <Button
                        size='lg'
                        className={'btn-block-sm-down'}
                        color="primary"            
                        onClick={() => removeFromCartFunc()}
                      >
                        {t('user.Remove from cart')}
                      </Button>
                    </div>                  
                  </>
                }
                {authUser && !inUserCart &&
                  <span>
                  <Button
                      size='lg'
                      className={'btn-block-sm-down'}
                      color="success"            
                      onClick={() => addToCartFunc()}
                    >
                      {t('user.Add to cart')}
                    </Button>
                  </span>
                }
              </div>
            )
          }        
        </div>        
      </div>
    </>
  );
};

ProductUserCart.propTypes = { 
};

export default ProductUserCart;
