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
import AddUserInvitesForm from "../../../../components/tenant/admin/AddUserInvitesForm";
import UserList from "../../../../components/tenant/admin/UserList";
import UserInvitesList from "../../../../components/tenant/admin/UserInvitesList";
import ManageClientInvite from "../../../../components/tenant/admin/ManageClientInvite";
import api from "../../../../utils/api";
import ManageClientUser from "../../../../components/tenant/admin/ManageClientUser";

export default function Clients() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const usersPerPage = 10;
  const invitesPerPage = 10;
  const [view, setView] = useState("users");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [invites, setInvites] = useState(null);
  const [selectedInvite, setSelectedInvite] = useState(null);
  const [invitesRequestItemsSignal, setInvitesRequestItemsSignal] =
    useState(null);

  const [users, setUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersRequestItemsSignal, setUsersRequestItemsSignal] =
    useState(null);

  const fetchInvites = async ({ skip, limit, search }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-user-invites`,
      params: {
        $skip: skip,
        $limit: limit,
        type: "client",
        ...(tenantId ? { tenant: tenantId } : {}),
        ...(search ? { search } : {}),
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

  const fetchUsers = async ({ skip, limit, search }) => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-users`,
      params: {
        $skip: skip,
        $limit: limit,
        type: "client",
        ...(tenantId ? { tenant: tenantId } : {}),
        ...(search ? { search } : {}),
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

  useEffect(() => {
    if (view === "invites") {
      fetchInvites({ skip: 0, limit: invitesPerPage }).catch(console.error);
    } else if (view === "users") {
      fetchUsers({ skip: 0, limit: invitesPerPage }).catch(console.error);
    }
  }, [view]);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12 col-md-6">
          <h3>{t("tenant.admin.Clients")}</h3>
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
              text={t("tenant.admin.client.Invite Clients")}
            />
          </Button>

          <Offcanvas isOpen={!!selectedInvite} direction="end" keyboard={true}>
            <OffcanvasHeader
              toggle={() => {
                setSelectedInvite(null);
              }}
            >
              {t("tenant.admin.users.Manage Invitation")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <ManageClientInvite
                invite={selectedInvite}
                tenant={tenantId}
                onResendInvite={() => {
                  // notify user
                  toast(t("tenant.admin.users.Invitation re-sent"), {
                    type: "success",
                  });
                }}
                onRevokeInvite={() => {
                  // notify user
                  toast(t("tenant.admin.users.Invitation revoked"), {
                    type: "success",
                  });
                  setSelectedInvite(null);
                  if (view === "invites") {
                    // signal the component to reset the pagination
                    setInvitesRequestItemsSignal(Date.now());
                  }
                }}
              />
            </OffcanvasBody>
          </Offcanvas>

          <Offcanvas isOpen={!!selectedUser} direction="end" keyboard={true}>
            <OffcanvasHeader
              toggle={() => {
                setSelectedUser(null);
              }}
            >
              {t("tenant.admin.users.Manage User")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <ManageClientUser
                userId={selectedUser?._id}
                tenant={tenantId}
                onUpdateUser={() => {
                  // notify user
                  toast(t("tenant.admin.users.User updated"), {
                    type: "success",
                  });
                  // setSelectedInvite(null);
                  if (view === "users") {
                    // signal the component to reset the pagination
                    setUsersRequestItemsSignal(Date.now());
                  }
                }}
                onDeactivateUser={() => {
                  // notify user
                  toast(t("tenant.admin.users.User deactivated"), {
                    type: "success",
                  });
                  // setSelectedInvite(null);
                  if (view === "users") {
                    // signal the component to reset the pagination
                    setUsersRequestItemsSignal(Date.now());
                  }
                }}
                onActivateUser={() => {
                  // notify user
                  toast(t("tenant.admin.users.User activated"), {
                    type: "success",
                  });
                  // setSelectedInvite(null);
                  if (view === "users") {
                    // signal the component to reset the pagination
                    setUsersRequestItemsSignal(Date.now());
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
              {t("tenant.admin.client.Invite Clients")}
            </OffcanvasHeader>
            <OffcanvasBody>
              <AddUserInvitesForm
                tenant={tenantId}
                type="client"
                onAddInvite={() => {
                  setShowInviteForm(false);
                  if (view === "invites") {
                    // signal the component to reset the pagination
                    setInvitesRequestItemsSignal(Date.now());
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
                className={view === "users" ? "active" : ""}
                onClick={() => {
                  setView("users");
                }}
              >
                <IconText icon="user" text={t("tenant.admin.users.Users")} />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={view === "invites" ? "active" : ""}
                onClick={() => {
                  setView("invites");
                }}
              >
                <IconText
                  icon="email"
                  text={t("tenant.admin.users.Invitations")}
                />
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={view} className="mt-3">
            <TabPane tabId="users">
              <div className="row">
                <div className="col-12">
                  {view === "users" ? (
                    <UserList
                      itemsPerPage={usersPerPage}
                      fetchUsers={fetchUsers}
                      users={users}
                      onSelectUser={(user) => {
                        setSelectedUser(user);
                      }}
                      requestItemsSignal={usersRequestItemsSignal}
                      t={t}
                    />
                  ) : (
                    null
                  )}
                  {users && !users.data?.length ? (
                    <h6 className="mt-4">
                      {t("tenant.admin.users.No users found")}
                    </h6>
                  ) : (
                    null
                  )}
                </div>
              </div>
            </TabPane>
            <TabPane tabId="invites">
              <div className="row">
                <div className="col-12">
                  {view === "invites" ? (
                    <UserInvitesList
                      itemsPerPage={invitesPerPage}
                      fetchInvites={fetchInvites}
                      invites={invites}
                      onSelectInvite={(invite) => {
                        setSelectedInvite(invite);
                      }}
                      requestItemsSignal={invitesRequestItemsSignal}
                      t={t}
                    />
                  ) : (
                    null
                  )}
                  {invites && !invites.data?.length ? (
                    <h6 className="mt-4">
                      {t(
                        "tenant.admin.users.No outstanding invitations found"
                      )}
                    </h6>
                  ) : (
                    null
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
