import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as UserContext } from "../../context/UserContext";
import api from "../../utils/api";
import { useTranslation } from "next-i18next";
import { Button, Alert, Progress } from "reactstrap";
import Loader from "../Loader";
import PlanList from "./PlanList";
import Plan from "./Plan";
import { useRouter } from "next/router";
import IconText from "../IconText";

const SelectPlan = ({}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);
  const { setUserEmailVerification } = useContext(UserContext);

  const [view, setView] = useState("select");

  const [processingCheckoutSuccess, setProcessingCheckoutSuccess] =
    useState(false);
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requestingPlans, setRequestingPlans] = useState(false);
  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [verificationResentSuccess, setVerificationResentSuccess] =
    useState(false);

  const fetchPlans = async () => {
    setRequestingPlans(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/plans?$sort[index]=1`,
    });

    if (response.status >= 200 && response.status < 300) {
      setPlans(response.data.data);
      setRequestingPlans(false);
      return { success: true };
    } else {
      setPlans(null);
      setRequestingPlans(false);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchPlans().catch(console.error);
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    if (view === "checkout") {
      Paddle.Checkout.open({
        product: selectedPlan.paddlePlanId,
        method: "inline",
        frameTarget: "paddle-inline-checkout",
        frameStyle: "width:100%;",
        email: auth?.user?.email,
        passthrough: `{"user_id": "${auth?.user?._id}", "plan_id": "${selectedPlan._id}"}`,
        successCallback: (resp) => {
          setView("processing");
          console.log(
            "🚀 ~ file: SelectPlan.js ~ line 63 ~ useEffect ~ resp",
            resp
          );
          let counter = 0;
          const checkInterval = setInterval(async () => {
            counter++;
            const response = await api({
              method: "get",
              url: `${process.env.NEXT_PUBLIC_API_URL}/tenants/${auth?.user?.tenant?._id}`,
            });
            if (response.status >= 200 && response.status < 300) {
              if (response.data.plan === selectedPlan._id) {
                // setProcessingCheckoutSuccess(false);
                clearInterval(checkInterval);
                // setShowSuccess(true);
                setView("success");
                getTenant();
                router.push(router.asPath);
              }
              return { success: true };
            } else {
              // setProcessingCheckoutSuccess(false);
              clearInterval(checkInterval);
              setView("error");
              // setShowSuccess(false);
              return { success: false };
            }
          }, 1000);
        },
      });
    }
  }, [view]);

  const Select = () => {
    return (
      <>
        {plans ? (
          <>
            <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
              <div className="col-12">
                <Progress value={60} striped={true} color="secondary" />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <h3>{t("plan.Select Your Plan to Continue")}</h3>
              </div>
            </div>
            <PlanList
              plans={plans}
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setView("confirm");
                router.push(router.asPath);
              }}
            />
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const Confirm = () => {
    return (
      <>
        <div className="row mt-2 pt-2">
          <div className="col-12">
            <Progress value={80} striped={true} color="secondary" />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-md-6 mb-5">
            <h3>{t("plan.Selected Plan")}</h3>
            <Plan
              plan={selectedPlan}
              showTag={false}
              showPaymentDetails={true}
            />
            <div className="d-flex justify-content-between">
              <Button
                className="mt-4 btn-block-md-down"
                color="default"
                onClick={() => {
                  setView("select");
                  setSelectedPlan(null);
                  router.push(router.asPath);
                }}
              >
                <IconText
                  icon="arrowLeft"
                  text={t("plan.Change plan")}
                />
              </Button>
              {selectedPlan.requiresCheckout ? (
                <Button
                  className="mt-4 btn-block-md-down"
                  color="default"
                  onClick={() => {
                    setView("checkout");
                    // router.push(router.asPath);
                  }}
                >
                  <IconText
                    icon="arrowRight"
                    iconEnd={true}
                    text={t("plan.Checkout")}
                  />
                </Button>
              ) : (
                <Button
                  className="mt-4 btn-block-md-down"
                  color="default"
                  onClick={() => {
                    // apply the plan
                    setView("success");
                  }}
                >
                  <IconText
                    icon="arrowRight"
                    iconEnd={true}
                    text={t("plan.Confirm")}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const Checkout = () => {
    return (
      <>
        <div className="row mt-2 pt-2">
          <div className="col-12">
            <Progress value={80} striped={true} color="secondary" />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-md-6 mb-5">
            <h3>{t("plan.Selected Plan")}</h3>
            <Plan
              plan={selectedPlan}
              showTag={false}
              showPaymentDetails={true}
            />
          </div>
          <div className="col-12 col-md-6">
            <h3>{t("plan.Checkout")}</h3>
            <div className="paddle-inline-checkout"></div>
          </div>
        </div>
      </>
    );
  };

  const Processing = () => {
    return <>processing</>;
  };

  const Success = () => {
    return <>success</>;
  };

  return (
    <>
      {view === "select" ? <Select /> : <></>}
      {view === "confirm" ? <Confirm /> : <></>}
      {view === "checkout" ? <Checkout /> : <></>}
      {view === "processing" ? <Processing /> : <></>}
      {view === "success" ? <Success /> : <></>}
    </>
  );
};

SelectPlan.propTypes = {};

SelectPlan.defaultProps = {};

export default SelectPlan;
