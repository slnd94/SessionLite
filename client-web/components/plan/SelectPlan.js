import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";
import api from "../../utils/api";
import { useTranslation } from "next-i18next";
import {
  Alert,
  Button,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Progress,
} from "reactstrap";
import Loader from "../Loader";
import PlanList from "./PlanList";
import Plan from "./Plan";
import { useRouter } from "next/router";
import IconText from "../IconText";
import { tenantPlanEligibility } from "../../utils/planUtils";
import PlanUsageCompare from "./PlanUsageCompare";

const SelectPlan = ({
  showProgress,
  currentPlan,
  currentUsage,
  backLink,
  onSelectPlan,
  onPlanUpdated,
}) => {
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
  const [detailPlan, setDetailPlan] = useState(null);

  const fetchPlans = async () => {
    setRequestingPlans(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/plans?$sort[index]=1`,
    });

    if (response.status >= 200 && response.status < 300) {
      setPlans(
        response.data.data.map((plan) => ({
          ...plan,
          ...(currentUsage
            ? {
                eligibility: tenantPlanEligibility({
                  plan: plan,
                  usage: currentUsage,
                }),
              }
            : {}),
        }))
      );
      setRequestingPlans(false);
      return { success: true };
    } else {
      setPlans(null);
      setRequestingPlans(false);
      return { success: false };
    }
  };

  const confirmPlanUpdated = async () => {
    const checkInterval = setInterval(async () => {
      const response = await api({
        method: "get",
        url: `${process.env.NEXT_PUBLIC_API_URL}/tenants/${auth?.user?.tenant?._id}`,
      });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.plan === selectedPlan._id) {
          clearInterval(checkInterval);
          getTenant({ id: tenant._id });
          if (onPlanUpdated) {
            onPlanUpdated();
          }
        }
        return { success: true };
      } else {
        clearInterval(checkInterval);
        setView("error");
        return { success: false };
      }
    }, 1000);
  };

  const selectPlan = (plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      setSelectedPlan(plan);
      if (plan.requiresCheckout && !tenant?.paddle?.subscriptionId) {
        setView("checkout");
      } else {
        setView("confirm");
      }
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchPlans().catch(console.error);
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    if (plans?.length && tenant?.tentativePlan) {
      selectPlan(
        plans.find((x) => x._id.toString() === tenant.tentativePlan.toString())
      );
    }
  }, [plans]);

  useEffect(() => {
    if (view === "checkout") {
      console.log(
        "🚀 ~ file: SelectPlan.js ~ line 140 ~ useEffect ~ selectedPlan",
        selectedPlan
      );
      console.log("🚀 ~ file: SelectPlan.js ~ line 159 ~ view", view);
      console.log(
        "element",
        document.getElementsByClassName("paddle-inline-checkout")
      );
      setTimeout(() => {
        Paddle.Checkout.open({
          product: selectedPlan.paddle.productId,
          method: "inline",
          frameTarget: "paddle-inline-checkout",
          frameStyle: "width:100%;",
          email: auth?.user?.email,
          passthrough: `{"user_id": "${auth?.user?._id}", "plan_id": "${selectedPlan._id}"}`,
          successCallback: async (resp) => {
            setView("processing");
            await confirmPlanUpdated();
          },
        });
      }, 250);
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
                  <div className="col-12 d-flex justify-content-between">
                    <h3>{t("plan.Select Your Plan")}</h3>
                  </div>
                </div>

                {backLink ? (
                  <IconText
                    className="text-secondary fw-bold fs-6"
                    icon="arrowLeft"
                    text={backLink.text}
                    onClick={() => {
                      backLink.onClick();
                    }}
                  />
                ) : null}
                <PlanList
                  plans={plans}
                  currentPlan={currentPlan}
                  onSelectPlan={(plan) => {
                    selectPlan(plan);
                  }}
                  onShowEligibilityDetail={(plan) => {
                    setDetailPlan(plan);
                  }}
                />
              </>
            ) : null}
            <Offcanvas isOpen={!!detailPlan} direction="end" keyboard={true}>
              <OffcanvasHeader
                toggle={() => {
                  setDetailPlan(null);
                }}
              >
                {t("tenant.admin.plan.Plan/Usage Details")}
              </OffcanvasHeader>
              <OffcanvasBody>
                <PlanUsageCompare plan={detailPlan} usage={currentUsage} />
                <Button
                  className="mt-4 btn-block"
                  color="default"
                  onClick={() => {
                    router.push(`/tenant/${tenant._id}/admin/clients`);
                  }}
                >
                  {t("tenant.admin.client.Manage Clients")}
                </Button>
                <Button
                  className="mt-2 btn-block"
                  color="default"
                  onClick={() => {
                    router.push(`/tenant/${tenant._id}/admin/team`);
                  }}
                >
                  {t("tenant.admin.team.Manage Team Members")}
                </Button>
                <Button
                  className="mt-2 btn-block"
                  color="default"
                  onClick={() => {
                    setDetailPlan(null);
                  }}
                >
                  <IconText
                    icon="arrowLeft"
                    text={t("tenant.admin.plan.Back to plans")}
                  />
                </Button>
              </OffcanvasBody>
            </Offcanvas>
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
          {selectedPlan && currentPlan && tenant?.paddle?.subscriptionId ? (
            <div className="col-12 col-md-6 mb-5">
              <ConfirmConditions />
            </div>
          ) : null}
          <div className="col-12 col-md-6 mb-5">
            <h3>{t("plan.Selected Plan")}</h3>
            <Plan
              plan={selectedPlan}
              showTag={false}
              // showPaymentDetails={selectedPlan.requiresCheckout}
            />
            <Button
              className="mt-4 btn-block"
              color="default"
              onClick={() => {
                setView("select");
                setSelectedPlan(null);
                router.push(router.asPath);
              }}
            >
              <IconText
                icon="arrowLeft"
                text={t("plan.Change selected plan")}
              />
            </Button>
            <Button
              className="mt-4 btn-block"
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
                  await confirmPlanUpdated();
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
                text={t("plan.Confirm selected plan")}
              />
            </Button>
          </div>
        </div>
      </>
    );
  };

  const ConfirmConditions = () => {
    return (
      <>
        {selectedPlan.requiresCheckout ? (
          <>
            {selectedPlan.subscription?.price?.gross >
            currentPlan.subscription?.price?.gross ? (
              <>
                {/* Upgrading plan */}
                <h3>{t("tenant.admin.plan.Upgrading Your Plan")}</h3>
                <ul className="mt-3 ms-n3">
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.The selected plan will be applied immediately"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.Your regular billing cycle dates will remain the same"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.You will be billed now at the prorated cost of the upgrade for the remaining time in this billing cycle"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.Since you have already paid for your current plan this cycle, this amount will be deducted from the upgrade cost"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.You will be billed the full cost of the selected plan at the start of your next billing cycle, and each cycle thereafter"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.We will continue to use your existing payment method for billing"
                    )}
                  </li>
                </ul>
              </>
            ) : null}
            {selectedPlan.subscription?.price?.gross <
            currentPlan.subscription?.price?.gross ? (
              <>
                {/* Downgrading plan */}
                <h3>{t("tenant.admin.plan.Downgrading Your Plan")}</h3>
                <ul className="mt-3 ms-n3">
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.The selected plan will be applied immediately"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.Your regular billing cycle dates will remain the same"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.You will receive a prorated credit balance for the remaining time in this billing cycle"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.The credit balance will be applied automatically to your next billing cycle"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.You will be billed the regular cost of the selected plan each cycle thereafter"
                    )}
                  </li>
                  <li>
                    {t(
                      "tenant.admin.plan.conditions.We will continue to use your existing payment method for billing"
                    )}
                  </li>
                </ul>
              </>
            ) : null}
          </>
        ) : (
          <>
            <h3>{t("tenant.admin.plan.Downgrading Your Plan")}</h3>
            <ul className="mt-3 ms-n3">
              <li>
                {t(
                  "tenant.admin.plan.conditions.The selected plan will be applied immediately"
                )}
              </li>
              <li>
                {t(
                  "tenant.admin.plan.conditions.Because you are moving to a free plan, this will be treated as a cancellation of your paid plan"
                )}
              </li>
              <li>
                {t(
                  "tenant.admin.plan.conditions.We are unable to grant refunds or credits for any unused portion of your current billing cycle"
                )}
              </li>
            </ul>
          </>
        )}
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
            <Button
              className="mt-4 btn-block"
              color="default"
              onClick={() => {
                setView("select");
                setSelectedPlan(null);
                router.push(router.asPath);
              }}
            >
              <IconText
                icon="arrowLeft"
                text={t("plan.Change selected plan")}
              />
            </Button>
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

  const Success = () => {
    return (
      <>
        <div className="row mt-5">
          <div className="col-12 d-flex justify-content-center">All Done!</div>
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
          <IconText icon="arrowLeft" text={t("plan.Change selected plan")} />
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
      {/* {backLink ? (
        <IconText
          className="mb-3 fw-bold"
          icon="arrowLeft"
          text={backLink.text}
          onClick={() => {
            backLink.onClick();
          }}
        />
      ) : null} */}
      {view === "select" ? <Select backLink /> : null}
      {view === "confirm" ? <Confirm /> : null}
      {view === "checkout" ? <Checkout /> : null}
      {view === "processing" ? <Processing /> : null}
      {view === "success" ? <Success /> : null}
      {view === "error" ? <Error /> : null}
    </>
  );
};

SelectPlan.propTypes = {
  showProgress: PropTypes.bool,
  currentPlan: PropTypes.object,
  currentUsage: PropTypes.object,
  backLink: PropTypes.object,
  onPlanUpdated: PropTypes.func,
};

SelectPlan.defaultProps = {
  showProgress: false,
  currentPlan: null,
  backLink: null,
};

export default SelectPlan;
