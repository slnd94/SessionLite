import React from 'react';
import PropTypes from 'prop-types';
import ProductListItem from '../product/ProductListItem';


const UserCartItem = ({ product, className, onClick }) => {
  return (
    <ProductListItem
      product={product}
      className={className}
      onClick={onClick}
    />
  );
};

UserCartItem.propTypes = {
  product: PropTypes.object
};

export default UserCartItem;
