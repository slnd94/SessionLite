import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import Amount from "../commerce/Amount";
import { Button } from "reactstrap";
import Loader from "../Loader";

const ProductUserCart = ({
  inUserCart,
  price,
  userProductStatus,
  authUser,
  addToCartFunc,
  removeFromCartFunc,
  processing,
  t,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="row">
        <div className="col-sm-3">
          <Amount
            amount={price}
            className="mr-4"
            style={{ fontSize: "2rem" }}
            t={t}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-sm-8">
          {processing ? (
            <Loader />
          ) : (
            !(
              userProductStatus.authUserAdmin ||
              userProductStatus.authUserPurchased
            ) && (
              <div>
                {inUserCart && (
                  <>
                    <h5>{t("user.cart.This product is in your cart")}</h5>
                    <div className="mt-4">
                      <Button
                        // size='lg'
                        className={"me-4 btn-block-sm-down"}
                        color="primary"
                        onClick={() => {
                          router.push({
                            pathname: `/user/cart`,
                          });
                        }}
                      >
                        {t("user.cart.View your cart")}
                      </Button>
                      <Button
                        className={"btn-block-sm-down"}
                        color="primary"
                        onClick={() => removeFromCartFunc()}
                      >
                        {t("user.cart.Remove from cart")}
                      </Button>
                    </div>
                  </>
                )}
                {authUser && !inUserCart && (
                  <span>
                    <Button
                      className={"btn-block-sm-down"}
                      color="primary"
                      onClick={() => addToCartFunc()}
                    >
                      {t("user.cart.Add to cart")}
                    </Button>
                  </span>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

ProductUserCart.propTypes = {
  inUserCart: PropTypes.bool,
  price: PropTypes.object,
  userProductStatus: PropTypes.object,
  authUser: PropTypes.bool,
  addToCartFunc: PropTypes.func,
  requestingAddProductToCart: PropTypes.bool,
  removeFromCartFunc: PropTypes.func,
  requestingRemoveProductFromCart: PropTypes.bool,
  processing: PropTypes.bool,
  t: PropTypes.func,
};

export default ProductUserCart;
