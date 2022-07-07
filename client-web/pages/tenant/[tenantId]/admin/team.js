import { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import api from "../../../../utils/api";
import IconText from "../../../../components/IconText";
import styles from "../../../../styles/Tenant.module.scss";
import UserList from "../../../../components/user/UserList";
import Loader from "../../../../components/Loader";
import {
  Button,
  Card,
  CardText,
  CardTitle,
  Col,
  Nav,
  NavItem,
  NavLink,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import TenantAddTeamForm from "../../../../components/tenant/admin/TenantAddTeamForm";

export default function Team() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const usersPerPage = 50;
  const [view, setView] = useState("team");
  const [showInviteForm, setShowInviteForm] = useState(false);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12 col-md-6">
          <h3>{t("tenant.admin.Team")}</h3>
        </div>
        <div className="col-12 col-md-6 text-md-end">
          <Button
            className={"btn-block-md-down"}
            // className={"btn-block"}
            size="md"
            color="secondary"
            onClick={() => {
              console.log("hi");
              setView("invites");
              setShowInviteForm(true)
            }}
          >
            <IconText
              icon="add"
              // iconPosition="end"
              text={t("tenant.admin.team.Add Team Members")}
            />
          </Button>
          <Offcanvas isOpen={showInviteForm} direction="end">
            <OffcanvasHeader
              toggle={() => {
                setShowInviteForm(false);
              }}
            >
              {t("tenant.admin.team.Add Team Members")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <TenantAddTeamForm tenant={tenantId} />
            </OffcanvasBody>
          </Offcanvas>
        </div>
      </div>
      {/* <div className="row mt-2 ms-md-3">
        <div className="col-12">You have 12 user slots available</div>
      </div> */}
      <div className="row mt-4 ms-md-3">
        <div className="col-12">
          <Nav pills>
            <NavItem>
              <NavLink
                className={view === "team" ? "active" : ""}
                onClick={() => {
                  setView("team");
                }}
              >
                Team
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={view === "invites" ? "active" : ""}
                onClick={() => {
                  setView("invites");
                }}
              >
                {t("tenant.admin.team.Invitations")}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={view} className="mt-3">
            <TabPane tabId="team">
              <div className="row">
                <div className="col-12">
                  <UserList
                    tenant={tenantId}
                    itemsPerPage={usersPerPage}
                    onSelectUser={() => {}}
                    t={t}
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tabId="invites">
              <div className="row">
                <div className="col-12">
                  <h4>{t("tenant.admin.team.Invitations")}</h4>
                </div>
              </div>
            </TabPane>
          </TabContent>
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
