import React from 'react';
import PropTypes from 'prop-types';


const UserCartItem = ({ item }) => {
  return (
    <div>
      {item.product.name}
    </div>
  );
};

UserCartItem.propTypes = {
  item: PropTypes.object
};

export default UserCartItem;
