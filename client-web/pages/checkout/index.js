// import Layout from '../components/user/Layout'
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useEffect, useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutSummary from "../../components/commerce/CheckoutSummary";
import UserCheckoutStripeForm from "../../components/commerce/UserCheckoutStripeForm";
import UserCart from "../../components/user/UserCart";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../utils/api";
import { Modal } from "reactstrap";
import styles from "../../styles/Checkout.module.scss";

export default function Checkout() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { cart },
    getUserCart,
  } = useContext(UserContext);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

  const createPaymentIntent = async () => {
    const response = await api({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_API_URL}/payments`,
    });

    if (response.status >= 200 && response.status < 300) {
      setPaymentIntent(response.data);
      return { success: true };
    } else {
      setPaymentIntent(null);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    createPaymentIntent();
    return () => (isSubscribed = false);
  }, []);

  return (
    <>
      {/* {processing
      ? <Modal><Loader /></Modal>
      : <></>
      } */}
      {!cart || !paymentIntent?.clientSecret ? (
        <Loader />
      ) : (
        <>
          {!cart?.items?.length ? (
            <h5 className={"title"}>{t("user.cart.Your cart is empty")}</h5>
          ) : (
            <div className="row mt-3 mt-md-0">
              {/* <div className="col-12 col-md-8 d-inline d-md-none">
            <h5 className={"title"}>Checkout</h5>
            <div className="section-box mt-4 mb-5 ">
              <CheckoutSummary />
            </div>
          </div> */}
              <div className="col-12 col-md-4">
                <h5 className={"title"}>{t("checkout.Checkout")}</h5>
                <div className="section-box mt-4 mb-5 ">
                  <CheckoutSummary cart={cart} />
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="mb-5">
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret: paymentIntent.clientSecret }}
                  >
                    <h5 className={"title"}>
                      {t("checkout.Payment Information")}
                    </h5>
                    <UserCheckoutStripeForm
                      processing={processing}
                      setProcessing={setProcessing}
                      total={cart?.total}
                      onSubmit={async (data) => {
                        // setProcessing(true);
                        // console.log("🚀 ~ file: checkout.js ~ line 74 ~ onSubmit={ ~ paymentIntent", paymentIntent)
                        // if (elements == null || !(paymentIntent?.clientSecret)) {
                        //   return;
                        // }
                        // const request = await stripe.createPaymentMethod({
                        //   type: 'card',
                        //   card: elements.getElement(CardElement),
                        // });
                        // console.log("🚀 ~ file: checkout.js ~ line 55 ~ onSubmit={ ~ request", request)
                        // if(request.success) {
                        //   // remove processing loader
                        //   setProcessing(false);
                        //   // notify user
                        //   toast(t(`user.User profile updated`), {
                        //     type: 'success'
                        //   });
                        // } else {
                        //   // remove preocessing loader
                        //   setProcessing(false);
                        // }
                      }}
                    />
                  </Elements>
                </div>
                <div className="mb-5">
                  <h5 className={"title"}>{t("checkout.Details")}</h5>
                  <UserCart
                    cart={cart}
                    auth={auth}
                    onRemoveItem={() => {
                      getUserCart({ id: auth.user._id });
                      toast(t(`user.cart.Removed from cart`), {
                        type: "info",
                      });
                      createPaymentIntent();
                    }}
                    t={t}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
