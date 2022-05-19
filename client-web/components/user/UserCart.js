import React from "react";
import PropTypes from "prop-types";
import PaginatedList from "../PaginatedList";
import UserCartItem from "./UserCartItem";
import api from "../../utils/api";

const UserCart = ({ cart, auth, onRemoveItem, itemsPerPage, t }) => {
  return (
    <>
      <PaginatedList
        items={cart?.items.length ? cart.items.map((item) => item.product) : []}
        itemComponent={UserCartItem}
        itemComponentCustomProps={{
          removeFromCartFunc: async (productId) => {
            if (auth?.status === "SIGNED_IN") {
              const response = await api({
                method: "patch",
                url: `${process.env.NEXT_PUBLIC_API_URL}/user-carts/${auth.user._id}`,
                params: {
                  removeProduct: productId,
                },
              });
              if (
                response.status >= 200 &&
                response.status < 300 &&
                response.data.success
              ) {
                onRemoveItem();
              }
            }
          },
          t,
        }}
        itemPropName={"product"}
        itemsListedName={t("product.products")}
        itemsPerPage={itemsPerPage}
        showPaginationTop
        showPaginationBottom
        hidePaginationForSinglePage
        itemNavRoute={"/product"}
        showLink={true}
        t={t}
        // onRef={ref => (this.paginatedList = ref)}
      />
    </>
  );
};

UserCart.propTypes = {
  cart: PropTypes.object,
  auth: PropTypes.object,
  onRemoveItem: PropTypes.func,
  itemsPerPage: PropTypes.number,
  t: PropTypes.func,
};

UserCart.defaultProps = {
  itemsPerPage: 5,
};

export default UserCart;
