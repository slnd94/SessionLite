import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as UserContext } from "../../../context/UserContext";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import ProductUserCart from "../../../components/products/ProductUserCart";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import styles from "../../../styles/User.module.scss";

export default function Product({ product }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { productId } = router.query;
  const { getUserCart } = useContext(UserContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userCurrencyCode, setUserCurrencyCode] = useState(
    process.env.DEFAULT_CURRENCY
  );
  const [processing, setProcessing] = useState(false);

  return (
    <>
      <Link href="/products">{t("products.Products")}</Link>
      {product ? (
        <div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="section-box">
                <h5 className={"title"}>{product.name}</h5>
                <p>{product.description}</p>
                <ul>
                  {product.features.map((feature, index) => {
                    return <li key={index}>{feature}</li>;
                  })}
                </ul>
                {product.authUserPurchased ? (
                  <h5>{t("You have purchased this product")}</h5>
                ) : (
                  <ProductUserCart
                    productId={product._id}
                    inUserCart={product.inUserCart}
                    price={{
                      figure: product.prices[userCurrencyCode],
                      currencyCode: userCurrencyCode,
                    }}
                    authUser={auth?.status === "SIGNED_IN"}
                    processing={processing}
                    addToCartFunc={async () => {
                      setProcessing(true);
                      if (auth?.status === "SIGNED_IN") {
                        const response = await api({
                          method: "patch",
                          url: `${process.env.NEXT_PUBLIC_API_URL}/user-carts/${auth.user._id}`,
                          params: {
                            addProduct: productId,
                          },
                        });
                        if (
                          response.status >= 200 &&
                          response.status < 300 &&
                          response.data.success
                        ) {
                          // get the updated cart
                          getUserCart({ id: auth.user._id });

                          // refresh with new data
                          await router.push(router.asPath);

                          // remove the loading indicator
                          setProcessing(false);

                          // notify user
                          toast(t(`user.cart.Added to cart`), {
                            type: "success",
                          });
                        }
                      }
                    }}
                    removeFromCartFunc={async () => {
                      setProcessing(true);
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
                          // get the updated cart
                          getUserCart({ id: auth.user._id });

                          // refresh with new data
                          await router.push(router.asPath);

                          // remove the loading indicator
                          setProcessing(false);

                          // notify user
                          toast(t(`user.cart.Removed from cart`), {
                            type: "info",
                          });
                        }
                      }
                    }}
                    userProductStatus={{
                      authUserAdmin: product.authUserAdmin,
                      authUserPurchased: product.authUserPurchased,
                    }}
                    t={t}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </>
  );
}

export const getServerSideProps = async ({
  locale,
  params: { productId },
  req: {
    cookies: { accessToken },
  },
}) => {
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    accessToken,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      product: response.data,
    },
  };
};
