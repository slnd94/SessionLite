import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";
import api from "../../utils/api";
import { useTranslation } from "next-i18next";
import { Alert, Button, Progress } from "reactstrap";
import Loader from "../Loader";
import PlanList from "./PlanList";
import Plan from "./Plan";
import { useRouter } from "next/router";
import IconText from "../IconText";

const SelectPlan = ({ showProgress, currentPlan, backLink }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);

  const [view, setView] = useState("select");

  const [error, setError] = useState(null);
  const [plans, setPlans] = useState(null);
  const [requestingPlans, setRequestingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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
        product: selectedPlan.paddle.productId,
        method: "inline",
        frameTarget: "paddle-inline-checkout",
        frameStyle: "width:100%;",
        email: auth?.user?.email,
        passthrough: `{"user_id": "${auth?.user?._id}", "plan_id": "${selectedPlan._id}"}`,
        successCallback: (resp) => {
          setView("processing");
          let counter = 0;
          const checkInterval = setInterval(async () => {
            counter++;
            const response = await api({
              method: "get",
              url: `${process.env.NEXT_PUBLIC_API_URL}/tenants/${auth?.user?.tenant?._id}`,
            });
            if (response.status >= 200 && response.status < 300) {
              if (response.data.plan === selectedPlan._id) {
                clearInterval(checkInterval);
                getTenant({ id: tenant._id });
                router.push("/tenant/register/success");
              }
              return { success: true };
            } else {
              clearInterval(checkInterval);
              setView("error");
              return { success: false };
            }
          }, 1000);
        },
      });
    }

    if (view !== "error") {
      setError(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [view]);

  const Select = () => {
    return (
      <>
        {requestingPlans ? (
          <div className="d-flex flex-column">
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
              <Loader />
            </div>
          </div>
        ) : (
          <>
            {plans ? (
              <>
                {showProgress ? (
                  <div
                    className="row mt-2 mb-4 pt-2"
                    style={{ opacity: "90%" }}
                  >
                    <div className="col-12">
                      <Progress value={60} striped={true} color="secondary" />
                    </div>
                  </div>
                ) : null}

                <div className="row">
                  <div className="col-12">
                    <h3>{t("plan.Select Your Plan")}</h3>
                  </div>
                </div>
                <PlanList
                  plans={plans}
                  currentPlan={currentPlan}
                  onSelectPlan={(plan) => {
                    setSelectedPlan(plan);
                    if (plan.requiresCheckout) {
                      setView("checkout");
                    } else {
                      setView("confirm");
                    }
                  }}
                />
              </>
            ) : null}
          </>
        )}
      </>
    );
  };

  const Confirm = () => {
    return (
      <>
        {showProgress ? (
          <div className="row mt-2 mb-4 pt-2">
            <div className="col-12">
              <Progress value={80} striped={true} color="secondary" />
            </div>
          </div>
        ) : null}
        <div className="row">
          <div className="col-12 col-md-6 mb-5">
            <h3>{t("plan.Selected Plan")}</h3>
            <Plan
              plan={selectedPlan}
              showTag={false}
              showPaymentDetails={selectedPlan.requiresCheckout}
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
              <Button
                className="mt-4 btn-block-md-down"
                color="secondary"
                onClick={async () => {
                  // apply the plan
                  setView("processing");
                  const response = await api({
                    method: "patch",
                    url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-plans/${tenant._id}`,
                    params: {
                      plan: selectedPlan._id,
                    },
                  });

                  if (response.status >= 200 && response.status < 300) {
                    getTenant({ id: tenant._id });
                    router.push("/tenant/register/success");
                    return { success: true };
                  } else {
                    setError(response.response.data);
                    setView("error");
                    return { success: false };
                  }
                }}
              >
                <IconText
                  icon="arrowRight"
                  iconPosition="end"
                  text={t("plan.Confirm plan")}
                />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Checkout = () => {
    return (
      <>
        {showProgress ? (
          <div className="row mt-2 mb-4 pt-2">
            <div className="col-12">
              <Progress value={80} striped={true} color="secondary" />
            </div>
          </div>
        ) : null}
        <div className="row">
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
            </div>
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
    return (
      <>
        <div className="row mt-5">
          <div className="col-12 d-flex justify-content-center">
            <Loader />
          </div>
        </div>
        <div className="row ">
          <div className="col-12 d-flex justify-content-center">
            {t("plan.Processing your plan")}
          </div>
        </div>
      </>
    );
  };

  const Error = () => {
    return (
      <>
        {error ? (
          <Alert color="danger" fade={false}>
            {t(`tenant.admin.plan.errors.${error.message}`)}
          </Alert>
        ) : null}

        {error.message === "Tenant not within plan allowances" ? (
          <PlanAllowancesError />
        ) : null}

        <Button
          className="mt-4 btn-block-md-down"
          color="default"
          onClick={() => {
            setView("select");
            setSelectedPlan(null);
            router.push(router.asPath);
          }}
        >
          <IconText icon="arrowLeft" text={t("plan.Change plan")} />
        </Button>
      </>
    );
  };

  const PlanAllowancesError = () => {
    return (
      <>
        <div className="my-5">
          <h5>{t("tenant.admin.plan.errors.What are your options?")}</h5>
          <ul>
            <li>
              {t(
                "tenant.admin.plan.errors.Select a plan with more users allowed"
              )}
            </li>
            <li>
              {t(
                "tenant.admin.plan.errors.Deactivate users or revoke invitations to bring your usage within the plan allowance"
              )}
            </li>
          </ul>
        </div>
      </>
    );
  };

  return (
    <>
      {backLink ? (
        <IconText
          className="mb-3 fw-bold"
          icon="arrowLeft"
          text={backLink.text}
          onClick={() => {
            backLink.onClick();
          }}
        />
      ) : null}
      {view === "select" ? <Select backLink /> : null}
      {view === "confirm" ? <Confirm /> : null}
      {view === "checkout" ? <Checkout /> : null}
      {view === "processing" ? <Processing /> : null}
      {view === "error" ? <Error /> : null}
    </>
  );
};

SelectPlan.propTypes = {
  showProgress: PropTypes.bool,
  currentPlan: PropTypes.object,
  backLink: PropTypes.object,
};

SelectPlan.defaultProps = {
  showProgress: false,
  currentPlan: null,
  backLink: null,
};

export default SelectPlan;
