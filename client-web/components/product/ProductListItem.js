import React from 'react';
import PropTypes from 'prop-types';


const ProductListItem = ({ product, className, onClick }) => {
  return (
    <div
      className={`list-item-box ${className}`}
      onClick={() => onClick ? onClick() : null}
    >
      <h5>{product.name}</h5>
      <p>{product.description}</p>
    </div>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.object
};

export default ProductListItem;
