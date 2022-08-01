import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import "react-multi-email/style.css";
import api from "../../../utils/api";
import { Alert, Button } from "reactstrap";
import confirm from "../../../utils/confirm";
import { useTranslation } from "next-i18next";
import UserCard from "../../user/UserCard";
import { Context as AuthContext } from "../../../context/AuthContext";
import ManageTeamUserForm from "./ManageTeamUserForm";
import PlanUsageCompare from "../../plan/PlanUsageCompare";
import { useRouter } from "next/router";

function ManageTeamUser({
  userId,
  tenant,
  currentPlan,
  onUpdateUser
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [activateError, setActivateError] = useState(false);
  const [deactivateError, setDeactivateError] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [requestedUsageExceedingPlan, setRequestedUsageExceedingPlan] =
    useState(null);

  const fetchUser = async () => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
    });

    if (response.status >= 200 && response.status < 300) {
      setUser(response.data);
      return { success: true };
    } else {
      setUser(null);
      return { success: false };
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {user ? (
        <>
          <UserCard user={user} />
          <div className="mt-5">
            <ManageTeamUserForm
              processing={processing}
              defaults={{
                active: user.active,
                tenantAdmin: user.tenantAdmin,
              }}
              ownUser={auth?.user?._id === user?._id}
              onSubmit={async (data) => {
                const confirmListItems = [];
                if (user.active && !data.active) {
                  // user is being deactivated
                  confirmListItems.push(
                    t(
                      "tenant.admin.users.The user will no longer be able to sign in on {{appName}}",
                      { appName: process.env.NEXT_APP_NAME }
                    )
                  );
                  confirmListItems.push(
                    t(
                      "tenant.admin.team.You will gain back one allowed active team member on your {{appName}} plan",
                      { appName: process.env.NEXT_APP_NAME }
                    )
                  );
                  confirmListItems.push(
                    t(
                      "tenant.admin.users.The user will remain in your list, in case you want to reactivate them in the future"
                    )
                  );
                }
                if (!user.active && data.active) {
                  // user is being activated
                  confirmListItems.push(
                    t(
                      "tenant.admin.users.The user will be able to sign in on {{appName}}",
                      { appName: process.env.NEXT_APP_NAME }
                    )
                  );
                  confirmListItems.push(
                    t(
                      "tenant.admin.team.The user will consume one allowed active team member on your {{appName}} plan",
                      { appName: process.env.NEXT_APP_NAME }
                    )
                  );
                }

                if (user.tenantAdmin && !data.tenantAdmin) {
                  // user is having tenant admin access revoked
                  confirmListItems.push(
                    t(
                      "tenant.admin.team.The user will no longer be able access the admin area"
                    )
                  );
                }
                if (data.active && !user.tenantAdmin && data.tenantAdmin) {
                  // user is being granted tenant admin access
                  confirmListItems.push(
                    t(
                      "tenant.admin.team.The user will be able access the admin area and perform all admin actions"
                    )
                  );
                }

                confirm(
                  t(
                    "tenant.admin.users.Are you sure you want to update this user?",
                    { appName: process.env.NEXT_APP_NAME }
                  ),
                  {
                    listItems: confirmListItems,
                  }
                ).then(async () => {
                  setProcessing(true);
                  const response = await api({
                    method: "patch",
                    url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-users/${tenant}`,
                    params: {
                      updateUser: user._id,
                      ...data,
                    },
                  });

                  if (response.status >= 200 && response.status < 300) {
                    if (onUpdateUser) {
                      onUpdateUser();
                    }
                    fetchUser();
                    setProcessing(false);
                    return { success: true };
                  } else {
                    setProcessing(false);
                    const result = response.response.data;
                    if (
                      result.code === 400 &&
                      result.message === "plan allowances exceeded"
                    ) {
                      setRequestedUsageExceedingPlan(
                        result.data.requestedUsage
                      );
                    } else {
                      setUpdateError(true);
                    }
                    return { success: false };
                  }
                });
              }}
            />
            {requestedUsageExceedingPlan ? (
              <Alert color="danger" fade={false} className="mt-5">
                <h5 className="mb-5">
                  {t(
                    "tenant.admin.plan.We cannot complete this action now, because it would exceed the limits of your plan."
                  )}
                </h5>
                <PlanUsageCompare
                  plan={currentPlan}
                  requestedUsage={requestedUsageExceedingPlan}
                />
                <Button
                  className="mt-5 btn-block"
                  color="default"
                  onClick={() => {
                    router.push(`/tenant/${tenant}/admin/plan`);
                  }}
                >
                  {t("tenant.admin.plan.Manage Plan")}
                </Button>
                <Button
                  className="mt-2 btn-block"
                  color="default"
                  onClick={() => {
                    router.push(`/tenant/${tenant}/admin/clients`);
                  }}
                >
                  {t("tenant.admin.client.Manage Clients")}
                </Button>
                <Button
                  className="mt-2 btn-block"
                  color="default"
                  onClick={() => {
                    router.push(`/tenant/${tenant}/admin/team`);
                  }}
                >
                  {t("tenant.admin.team.Manage Team Members")}
                </Button>
              </Alert>
            ) : null}
          </div>
        </>
      ) : null}

      {auth?.user?._id === user?._id && user?.active ? (
        <div className="mt-3 d-flex justify-content-end">
          {t(`tenant.admin.team.You cannot modify your own permissions`)}
        </div>
      ) : null}
      {updateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.users.There was a problem updating this user`)}
        </Alert>
      ) : null}
      {deactivateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.users.There was a problem deactivating this user`)}
        </Alert>
      ) : null}
      {activateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.users.There was a problem activating this user`)}
        </Alert>
      ) : null}
    </>
  );
}

ManageTeamUser.propTypes = {
  user: PropTypes.object,
  tenant: PropTypes.string,
  currentPlan: PropTypes.object,
  onDeactivateUser: PropTypes.func,
  onActivateUser: PropTypes.func,
};

export default ManageTeamUser;
