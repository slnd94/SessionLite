import React from 'react';
import PropTypes from 'prop-types';


const UserCartItem = ({ item }) => {
  return (
    <div className="list-item-box">
      <h5>{item.product.name}</h5>
      <p>{item.product.description}</p>
    </div>
  );
};

UserCartItem.propTypes = {
  item: PropTypes.object
};

export default UserCartItem;
