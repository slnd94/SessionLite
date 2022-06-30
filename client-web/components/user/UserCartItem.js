import React from "react";
import PropTypes from "prop-types";
import ProductListItem from "../products/ProductListItem";

const UserCartItem = ({
  product,
  className,
  onClick,
  removeFromCartFunc,
  t,
}) => {
  return (
    <>
      <ProductListItem
        product={product}
        className={className}
        onClick={onClick}
        customButtons={[
          {
            className: "btn-block-md-down",
            color: "default",
            label: t("user.cart.Remove from cart"),
            onClick: () => removeFromCartFunc(product._id),
          },
        ]}
      />
    </>
  );
};

UserCartItem.propTypes = {
  product: PropTypes.object,
};

export default UserCartItem;
