import { useState, useEffect } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
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

export default function Team() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const usersPerPage = 10;
  const invitesPerPage = 10;
  const [view, setView] = useState("team");
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  const [invites, setInvites] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [
    teamInvitesRequestItemsSignal,
    setTeamInvitesRequestItemsSignal,
  ] = useState(null);

  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [
    teamUsersRequestItemsSignal,
    setTeamUsersRequestItemsSignal,
  ] = useState(null);

  const fetchUsers = async ({ skip, limit }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team`,
      params: {
        $skip: skip,
        $limit: limit,
        ...(tenantId ? { tenant: tenantId } : {}),
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setUsers(response.data);
      return { success: true };
    } else {
      setUsers(null);
      return { success: false };
    }
  };

  const fetchInvites = async ({ skip, limit }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team-invites`,
      params: {
        $skip: skip,
        $limit: limit,
        ...(tenantId ? { tenant: tenantId } : {}),
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setInvites(response.data);
      return { success: true };
    } else {
      setInvites(null);
      return { success: false };
    }
  };

  useEffect(() => {
    if (view === "invites") {
      fetchInvites({ skip: 0, limit: invitesPerPage }).catch(console.error);
    } else if (view === "team") {
      fetchUsers({ skip: 0, limit: invitesPerPage }).catch(console.error);
    }
  }, [view]);

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
              // setView("invites");
              setShowInviteForm(true);
            }}
          >
            <IconText
              icon="add"
              // iconPosition="end"
              text={t("tenant.admin.team.Invite Team Members")}
            />
          </Button>

          <Offcanvas isOpen={selectedInvite} direction="end" keyboard={true}>
            <OffcanvasHeader
              toggle={() => {
                setSelectedInvite(null);
              }}
            >
              {t("tenant.admin.team.Manage Invitation")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <ManageTeamInvite
                invite={selectedInvite}
                tenant={tenantId}
                onResendInvite={() => {
                  // notify user
                  toast(t("tenant.admin.team.Invitation re-sent"), {
                    type: "success",
                  });
                }}
                onRevokeInvite={() => {
                  // notify user
                  toast(t("tenant.admin.team.Invitation revoked"), {
                    type: "success",
                  });
                  setSelectedInvite(null);
                  if (view === "invites") {
                    // signal the component to reset the pagination
                    setTeamInvitesRequestItemsSignal(Date.now());
                  }
                }}
              />
            </OffcanvasBody>
          </Offcanvas>

          <Offcanvas isOpen={selectedUser} direction="end" keyboard={true}>
            <OffcanvasHeader
              toggle={() => {
                setSelectedUser(null);
              }}
            >
              {t("tenant.admin.team.Manage User")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <ManageTeamUser
                user={selectedUser}
                tenant={tenantId}
                onDeactivateUser={() => {
                  // notify user
                  toast(t("tenant.admin.team.User deactivated"), {
                    type: "success",
                  });
                  // setSelectedInvite(null);
                  if (view === "team") {
                    setSelectedUser(null)
                    // signal the component to reset the pagination
                    setTeamUsersRequestItemsSignal(Date.now());
                  }
                }}
                onActivateUser={() => {
                  // notify user
                  toast(t("tenant.admin.team.User activated"), {
                    type: "success",
                  });
                  // setSelectedInvite(null);
                  if (view === "team") {
                    setSelectedUser(null)
                    // signal the component to reset the pagination
                    setTeamUsersRequestItemsSignal(Date.now());
                  }
                }}
              />
            </OffcanvasBody>
          </Offcanvas>

          <Offcanvas isOpen={showInviteForm} direction="end" keyboard={true}>
            <OffcanvasHeader
              toggle={() => {
                setShowInviteForm(false);
              }}
            >
              {t("tenant.admin.team.Invite Team Members")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <AddTeamInvitesForm
                tenant={tenantId}
                onAddInvite={() => {
                  setShowInviteForm(false);
                  if (view === "invites") {
                    // signal the component to reset the pagination
                    setTeamInvitesRequestItemsSignal(Date.now());
                  }
                }}
              />
            </OffcanvasBody>
          </Offcanvas>
        </div>
      </div>
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
                {t("tenant.admin.team.Team")}
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
                  {view === "team" ? (
                    <TeamUserList
                      itemsPerPage={usersPerPage}
                      fetchUsers={fetchUsers}
                      users={users}
                      onSelectUser={(user) => {
                        setSelectedUser(user);
                      }}
                      requestItemsSignal={teamUsersRequestItemsSignal}
                      t={t}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </TabPane>
            <TabPane tabId="invites">
              <div className="row">
                <div className="col-12">
                  {invites && !invites.data?.length ? (
                    <h6>
                      {t(
                        "tenant.admin.team.There are no outstanding team member invitations"
                      )}
                    </h6>
                  ) : (
                    <></>
                  )}
                  {view === "invites" ? (
                    <TeamInvitesList
                      itemsPerPage={invitesPerPage}
                      fetchInvites={fetchInvites}
                      invites={invites}
                      onSelectInvite={(invite) => {
                        setSelectedInvite(invite);
                      }}
                      requestItemsSignal={teamInvitesRequestItemsSignal}
                      t={t}
                    />
                  ) : (
                    <></>
                  )}
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
