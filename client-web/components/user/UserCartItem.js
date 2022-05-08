import React from 'react';
import PropTypes from 'prop-types';


const UserCartItem = ({ product, className, onClick }) => {
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

UserCartItem.propTypes = {
  product: PropTypes.object
};

export default UserCartItem;
