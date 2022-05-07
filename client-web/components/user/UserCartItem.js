import React from 'react';
import PropTypes from 'prop-types';


const UserCartItem = ({ item }) => {
console.log("🚀 ~ file: UserCartItem.js ~ line 6 ~ UserCartItem ~ item", item)
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
