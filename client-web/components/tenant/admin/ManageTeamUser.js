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

function ManageTeamUser({ userId, tenant, onUpdateUser, onDeactivateUser, onActivateUser }) {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [activateError, setActivateError] = useState(false);
  const [deactivateError, setDeactivateError] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchUser = async () => {
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
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
                tenantAdmin: user.tenantAdmin
              }}
              ownUser={auth?.user?._id === user?._id}
              onSubmit={async (data) => {
                const confirmListItems = [];
                if(user.active && !data.active) {
                  // user is being inactivated
                  confirmListItems.push(t(
                    "tenant.admin.team.The user will no longer be able to sign in on {{appName}}", 
                    { appName: process.env.NEXT_APP_NAME }
                  ));
                  confirmListItems.push(t(
                    "tenant.admin.team.You will gain back one allowed active team member on your {{appName}} plan", 
                    { appName: process.env.NEXT_APP_NAME }
                  ));
                }
                if(!user.active && data.active) {
                  // user is being activated
                  confirmListItems.push(t(
                    "tenant.admin.team.The user will be able to sign in on {{appName}}", 
                    { appName: process.env.NEXT_APP_NAME }
                  ));
                  confirmListItems.push(t(
                    "tenant.admin.team.The user will consume one allowed active team member on your {{appName}} plan", 
                    { appName: process.env.NEXT_APP_NAME }
                  ));
                }   

                if(user.tenantAdmin && !data.tenantAdmin) {
                  // user is having tenant admin access revoked
                  confirmListItems.push(t(
                    "tenant.admin.team.The user will no longer be able access the admin area"
                  ));
                }
                if(data.active && !user.tenantAdmin && data.tenantAdmin) {
                  // user is being granted tenant admin access
                  confirmListItems.push(t(
                    "tenant.admin.team.The user will be able access the admin area and perform all admin actions"
                  ));
                }    

                confirm(
                  t(
                    "tenant.admin.team.Are you sure you want to update this user?", 
                    { appName: process.env.NEXT_APP_NAME }
                  ), {
                    listItems: confirmListItems
                  }
                ).then(async () => {
                  setProcessing(true);
                  const response = await api({
                    method: "patch",
                    url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-users/${tenant}`,
                    params: {
                      updateUser: user._id,
                      ...data
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
                    setUpdateError(true);
                    setProcessing(false);
                    return { success: false };
                  }
                });
              }}
            />
          </div>
        </>
      ) : (
        null
      )}

      {auth?.user?._id === user?._id && user?.active ? (
        <div className="mt-3 d-flex justify-content-end">
          {t(`tenant.admin.team.You cannot modify your own permissions`)}
        </div>
      ) : null}
      {updateError ? (
        <Alert color="danger" fade={false}>
          {t(`tenant.admin.team.There was a problem updating this user`)}
        </Alert>
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
