import React, { useState } from "react";
import PropTypes from "prop-types";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import Loader from "../../Loader";
import { useTranslation } from "next-i18next";
import PlanUsageCompare from "../../plan/PlanUsageCompare";

function AddUserInvitesForm({
  tenant,
  type,
  onAddInvite,
  currentPlan,
  currentUsage,
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [addEmails, setAddEmails] = useState([]);
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [requestedUsageExceedingPlan, setRequestedUsageExceedingPlan] =
    useState(null);

  return (
    <>
      <p>
        {t(
          type === "team"
            ? "tenant.admin.team.Add email addresses and send invitations to your team members to sign up and start using {{appName}} with you."
            : "tenant.admin.client.Add email addresses and send invitations to your clients to sign up and start using {{appName}} with you.",
          { tenantName: tenant.name, appName: process.env.NEXT_APP_NAME }
        )}
      </p>
      <p>
        {t(
          "tenant.admin.users.If you have more than one email address to add, separate the addresses with a comma."
        )}
      </p>
      <ReactMultiEmail
        placeholder={t("tenant.admin.users.Add Email Addresses")}
        emails={addEmails}
        onChange={(_emails) => {
          setAddEmails(_emails);
          if (_emails.length < 1) {
            setEmailRequiredError(true);
          } else {
            setEmailRequiredError(false);
          }
        }}
        validateEmail={(email) => {
          return isEmail(email); // return boolean
        }}
        getLabel={(email, index, removeEmail) => {
          return (
            <div data-tag key={index}>
              {email}
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          );
        }}
      />
      {emailRequiredError ? (
        <div style={{ color: "red" }}>
          {t("tenant.admin.users.At least one email address is required")}
        </div>
      ) : null}
      {processing ? (
        <Loader />
      ) : (
        <Button
          className={"btn-block-md-down mt-3"}
          color="primary"
          onClick={async () => {
            if (addEmails.length < 1) {
              setEmailRequiredError(true);
            } else {
              // add the invites
              setProcessing(true);
              const response = await api({
                method: "patch",
                url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-user-invites/${tenant}`,
                params: {
                  inviteEmailAddresses: addEmails,
                  type,
                },
              });

              if (response.status >= 200 && response.status < 300) {
                setProcessing(false);
                // notify user
                const notificationString =
                  addEmails.length === 1
                    ? t("tenant.admin.users.Invitation sent")
                    : `${addEmails.length} ${t(
                        "tenant.admin.users.invitations sent"
                      )}`;
                toast(notificationString, {
                  type: "success",
                });
                setAddEmails([]);
                if (onAddInvite) {
                  onAddInvite();
                }
                return { success: true };
              } else {
                // setView("error");
                setProcessing(false);
                const result = response.response.data;
                if (
                  result.code === 400 &&
                  result.message === "plan allowances exceeded"
                ) {
                  setRequestedUsageExceedingPlan(result.data.requestedUsage);
                }
                return { success: false };
              }
            }
          }}
        >
          {t("tenant.admin.users.Send Invitations")}
        </Button>
      )}
      {requestedUsageExceedingPlan ? (
        <Alert color="danger" fade={false} className="mt-5">
          <h5 className="mb-5">
            {t(
              "tenant.admin.plan.We cannot complete this action now, because it would exceed the limits of your plan."
            )}
          </h5>
          <PlanUsageCompare
            plan={currentPlan}
            usage={currentUsage}
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
    </>
  );
}

AddUserInvitesForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default AddUserInvitesForm;
