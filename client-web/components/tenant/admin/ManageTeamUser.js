import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import "react-multi-email/style.css";
import api from "../../../utils/api";
import { Alert, Button } from "reactstrap";
import confirm from "../../../utils/confirm";
import { useTranslation } from "next-i18next";
import UserCard from "../../user/UserCard";
import { Context as AuthContext } from "../../../context/AuthContext";

function ManageTeamUser({ user, tenant, onDeactivateUser, onActivateUser }) {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [activateError, setActivateError] = useState(false);
  const [deactivateError, setDeactivateError] = useState(false);

  return (
    <>
      <UserCard user={user} />
      <div className="mt-4 d-md-flex justify-content-md-end">
        {user?.active ? (
          <Button
            className={"btn-block-md-down"}
            size="md"
            color="default"
            disabled={auth?.user?._id === user?._id}
            onClick={() => {
              confirm(
                t(
                  "tenant.admin.team.Are you sure you want to deactivate this user? The user will no longer be able to sign in to {{appName}}.",
                  { appName: process.env.NEXT_APP_NAME }
                )
              ).then(async () => {
                const response = await api({
                  method: "patch",
                  url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team/${tenant}`,
                  params: {
                    deactivateUser: user._id,
                  },
                });

                if (response.status >= 200 && response.status < 300) {
                  if (onDeactivateUser) {
                    onDeactivateUser();
                  }
                  return { success: true };
                } else {
                  setDeactivateError(true);
                  return { success: false };
                }
              });
            }}
          >
            {t("tenant.admin.team.Deactivate User")}
          </Button>
        ) : (
          <Button
            className={"btn-block-md-down"}
            size="md"
            color="default"
            disabled={auth?.user?._id === user?._id}
            onClick={() => {
              confirm(
                t(
                  "tenant.admin.team.Are you sure you want to activate this user? The user will be able to sign in to {{appName}}.",
                  { appName: process.env.NEXT_APP_NAME }
                )
              ).then(async () => {
                const response = await api({
                  method: "patch",
                  url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team/${tenant}`,
                  params: {
                    activateUser: user._id,
                  },
                });

                if (response.status >= 200 && response.status < 300) {
                  if (onActivateUser) {
                    onActivateUser();
                  }
                  return { success: true };
                } else {
                  setActivateError(true);
                  return { success: false };
                }
              });
            }}
          >
            {t("tenant.admin.team.Activate User")}
          </Button>
        )}
      </div>
      {auth?.user?._id === user?._id && user?.active ? (
        <div className="mt-3 d-flex justify-content-end">
          {t(`tenant.admin.team.You cannot deactivate yourself`)}
        </div>
      ) : null}
      {deactivateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.team.There was a problem deactivating this user`)}
        </Alert>
      ) : null}
      {activateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.team.There was a problem activating this user`)}
        </Alert>
      ) : null}
    </>
  );
}

ManageTeamUser.propTypes = {
  user: PropTypes.object,
  tenant: PropTypes.string,
  onDeactivateUser: PropTypes.func,
  onActivateUser: PropTypes.func,
};

export default ManageTeamUser;
