import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "react-multi-email/style.css";
import api from "../../../utils/api";
import {
  Button,
} from "reactstrap";
import confirm from "../../../utils/confirm";
import { useTranslation } from "next-i18next";

function ManageClientInvite({ invite, tenant, onResendInvite, onRevokeInvite }) {
  const { t } = useTranslation("common");

  return (
    <>
      <div>{invite?.email}</div>
      <div className="mt-4 d-md-flex justify-content-md-around">
        <Button
          className={"btn-block-md-down"}
          size="md"
          color="default"
          onClick={() => {
            confirm(
              t(
                "tenant.admin.users.Are you sure you want to re-send this invitation?"
              )
            ).then(async () => {
              const response = await api({
                method: "patch",
                url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-user-invites/${tenant}`,
                params: {
                  resendInvite: invite._id,
                },
              });

              if (response.status >= 200 && response.status < 300) {
                onResendInvite();
                return { success: true };
              } else {
                return { success: false };
              }
            });
          }}
        >
          {t("tenant.admin.users.Re-send Invitation")}
        </Button>
        <Button
          className={"btn-block-md-down"}
          size="md"
          color="default"
          onClick={() => {
            confirm(
              t(
                "tenant.admin.users.Are you sure you want to revoke this invitation? The invitee will no longer be able to sign up using this invitation."
              )
            ).then(async () => {
              const response = await api({
                method: "patch",
                url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-user-invites/${tenant}`,
                params: {
                  revokeInvite: invite._id,
                },
              });

              if (response.status >= 200 && response.status < 300) {
                onRevokeInvite();
                return { success: true };
              } else {
                return { success: false };
              }
            });
          }}
        >
          {t("tenant.admin.users.Revoke Invitation")}
        </Button>
      </div>
    </>
  );
}

ManageClientInvite.propTypes = {
  invite: PropTypes.object,
  tenant: PropTypes.string,
  onResendInvite: PropTypes.func,
  onRevokeInvite: PropTypes.func
};

export default ManageClientInvite;
