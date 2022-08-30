import { useState, useEffect, useContext } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Context as TenantContext } from "../../../../context/TenantContext";
import { useRouter } from "next/router";
import { Button } from "reactstrap";
import { toast } from "react-toastify";
import api from "../../../../utils/api";
import SelectPlan from "../../../../components/plan/SelectPlan";
import Plan from "../../../../components/plan/Plan";
import UserCounts from "../../../../components/tenant/admin/UserCounts";
import { tenantPlanEligibility } from "../../../../utils/planUtils";

export default function TenantPlan() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const [view, setView] = useState("current");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentUsage, setCurrentUsage] = useState(null);

  const fetchCurrentPlan = async () => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-plans/${tenantId}`,
    });

    if (response.status >= 200 && response.status < 300) {
      setCurrentPlan(response.data);
      return { success: true };
    } else {
      setCurrentPlan(null);
      return { success: false };
    }
  };

  const fetchCurrentUsage = async () => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-usage/${tenantId}`,
    });

    if (response.status >= 200 && response.status < 300) {
      setCurrentUsage(response.data);
      return { success: true };
    } else {
      setCurrentUsage(null);
      return { success: false };
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
    fetchCurrentUsage();
  }, []);

  useEffect(() => {
    if (view === "current") {
    } else if (view === "select") {
    } else if (view === "confirm") {
    }
  }, [view]);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          {view === "current" ? (
            <div className="row">
              {currentPlan && currentUsage ? (
                <>
                  <div className="col-12 col-md-6 mb-5">
                    <div className="row mt-0">
                      <div className="col-12">
                        <h3>{t("tenant.admin.plan.Your Current Plan")}</h3>
                      </div>
                    </div>
                    <Plan
                      plan={{
                        ...currentPlan,
                        eligibility: tenantPlanEligibility({
                          plan: currentPlan,
                          usage: currentUsage,
                        }),
                      }}
                      className={currentPlan.tag ? "popular" : ""}
                    />
                    <Button
                      className="mt-4 btn-block"
                      size="lg"
                      color="primary"
                      onClick={() => {
                        setView("select");
                      }}
                    >
                      {t("plan.View available plans")}
                    </Button>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="row mt-0">
                      <div className="col-12">
                        <h3>{t("tenant.admin.plan.Plan Limits")}</h3>
                      </div>
                    </div>
                    <UserCounts usage={currentPlan.allowances} />
                    <div className="row mt-5">
                      <div className="col-12">
                        <h3>{t("tenant.admin.plan.Your Current Usage")}</h3>
                      </div>
                    </div>
                    <UserCounts
                      usage={currentUsage}
                      planEligibility={tenantPlanEligibility({
                        plan: currentPlan,
                        usage: currentUsage,
                      })}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
          {view === "select" ? (
            <div>
              <SelectPlan
                currentPlan={currentPlan}
                currentUsage={currentUsage}
                backLink={{
                  text: "",
                  onClick: () => {
                    setView("current");
                  },
                }}
                onPlanUpdated={async () => {
                  await fetchCurrentPlan();
                  toast(
                    t(
                      `tenant.admin.plan.Plan updated`
                    ),
                    {
                      type: "success",
                    }
                  );
                  setView("current");
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
