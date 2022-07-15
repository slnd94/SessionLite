import { useState, useEffect, useContext } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Context as TenantContext } from "../../../../context/TenantContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import IconText from "../../../../components/IconText";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  TabContent,
  TabPane,
} from "reactstrap";
import AddTeamInvitesForm from "../../../../components/tenant/admin/AddTeamInvitesForm";
import TeamUserList from "../../../../components/tenant/admin/TeamUserList";
import TeamInvitesList from "../../../../components/tenant/admin/TeamInvitesList";
import ManageTeamInvite from "../../../../components/tenant/admin/ManageTeamInvite";
import api from "../../../../utils/api";
import ManageTeamUser from "../../../../components/tenant/admin/ManageTeamUser";
import TenantPlanCurrent from "../../../../components/tenant/admin/CurrentPlan";
import SelectPlan from "../../../../components/plan/SelectPlan";
import Plan from "../../../../components/plan/Plan";

export default function TenantPlan() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const [view, setView] = useState("current");
  const [currentPlan, setCurrentPlan] = useState(null);

  const fetchCurrentPlan = async () => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/plans/${tenant.plan}`,
    });

    if (response.status >= 200 && response.status < 300) {
      setCurrentPlan(response.data);
      return { success: true };
    } else {
      setCurrentPlan(null);
      return { success: false };
    }
  };

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  useEffect(() => {
    if (view === "current") {
    } else if (view === "select") {
    } else if (view === "confirm") {
    }
  }, [view]);

  const getTitle = () => {
    switch (view) {
      case "current":
        return t("tenant.admin.plan.Your Current Plan");
      case "select":
        return t("tenant.admin.plan.Select Your Plan");
      case "confirm":
        return t("tenant.admin.plan.Confirm Your Plan");
    }
  };

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          {view === "current" ? (
            <div>
              {/* {JSON.stringify(tenant.plan)} */}
              {currentPlan ? (
                <>
                  <div className="row mt-0">
                    <div className="col-12">
                      <h3>{t("tenant.admin.plan.Your Current Plan")}</h3>
                    </div>
                  </div>
                  <Plan plan={currentPlan} className={currentPlan.tag ? "popular" : ""} />
                  <Button
                    className="mt-4 btn-block-md-down"
                    size="lg"
                    color="secondary"
                    onClick={() => {
                      setView("select");
                    }}
                  >
                    {t("plan.Change plan")}
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
          {view === "select" ? (
            <div>
              <SelectPlan currentPlan={currentPlan} />
            </div>
          ) : null}
          {view === "confirm" ? <div>Confirm plan</div> : null}
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
