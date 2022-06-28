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

const SelectPlan = ({}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
    getTenant
  } = useContext(TenantContext);
  const { setUserEmailVerification } = useContext(UserContext);
  const [processingCheckoutSuccess, setProcessingCheckoutSuccess] =
    useState(false);
  const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
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
    // if (admin) {
    let isSubscribed = true;
    fetchPlans().catch(console.error);
    return () => (isSubscribed = false);
    // }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      Paddle.Checkout.open({
        product: selectedPlan.paddlePlanId,
        // method: "overlay",
        // frameTarget: "paddle-inline-checkout",
        // frameInitialHeight: 416,
        // frameStyle: "width:100%;",
        email: auth?.user?.email,
        passthrough: `{"user_id": "${auth?.user?._id}", "plan_id": "${selectedPlan._id}"}`,
        // eventCallback: (data) => {
        //   // The data.event will specify the event type
        //   if (data.event === "Checkout.Complete") {

        //   } else if (data.event === "Checkout.Location.Submit") {
        //     setCheckoutSubmitted(true);
        //   }
        // },
        // submitCallback: (resp) => {
        //   setCheckoutSubmitted(true);
        // },
        successCallback: (resp) => {
          setProcessingCheckoutSuccess(true);
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
                setProcessingCheckoutSuccess(false);
                clearInterval(checkInterval);
                setCheckoutSuccess(true);
                getTenant();
                router.push(router.asPath)
              }
              // setPlans(response.data.data);
              // setRequestingPlans(false);
              return { success: true };
            } else {
              // setPlans(null);
              // setRequestingPlans(false);
              setProcessingCheckoutSuccess(false);
              clearInterval(checkInterval);
              setCheckoutSuccess(false);
              return { success: false };
            }
          }, 5000);
        },
      });
    }
  }, [selectedPlan]);

  return (
    <>
      {selectedPlan ? (
        <>
          {checkoutSuccess ? (
            <div className="col-12 col-md-6 d-flex justify-content-center align-content-center">
              Success!!!!
            </div>
          ) : (
            <>
              <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
                <div className="col-12">
                  <Progress value={80} striped={true} color="secondary" />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-sm-6">
                  <h1>{t("plan.Selected Plan")}</h1>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <Plan plan={selectedPlan} showTag={false} />
                  {!checkoutSubmitted ? (
                    <Button
                      className="mt-4 btn-block-md-down"
                      color="secondary"
                      onClick={() => {
                        setSelectedPlan(null);
                        router.push(router.asPath);
                      }}
                    >
                      {t("plan.Change selected plan")}
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                {processingCheckoutSuccess ? (
                  <div className="col-12 col-md-6 d-flex justify-content-center align-content-center">
                    <Loader />
                  </div>
                ) : (
                  <div className="col-12 col-md-6">
                    <div className="paddle-inline-checkout pt-5"></div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {plans ? (
            <>
              <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
                <div className="col-12">
                  <Progress value={60} striped={true} color="secondary" />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-12 col-sm-6">
                  <h1>{t("plan.Select Your Plan")}</h1>
                </div>
              </div>
              <PlanList
                plans={plans}
                onSelectPlan={(plan) => {
                  setSelectedPlan(plan);
                  router.push(router.asPath);
                }}
              />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

SelectPlan.propTypes = {};

SelectPlan.defaultProps = {};

export default SelectPlan;
