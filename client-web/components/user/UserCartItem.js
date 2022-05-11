import React from 'react';
import PropTypes from 'prop-types';
import ProductListItem from '../product/ProductListItem';

const UserCartItem = ({ product, className, onClick, removeFromCartFunc, t }) => {
  return (
    <>
      <ProductListItem
        product={product}
        className={className}
        onClick={onClick}
        customButtons={[
          {
            className: 'btn-block-sm-down',
            color: 'primary',
            label: t('user.Remove from cart'),
            onClick: () => removeFromCartFunc(product._id)
          }
        ]}
      />
    </>
  );
};

UserCartItem.propTypes = {
  product: PropTypes.object
};

export default UserCartItem;
