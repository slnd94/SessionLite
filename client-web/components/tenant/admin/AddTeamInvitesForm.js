import React, { useState } from "react";
import PropTypes from "prop-types";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
// import { useForm, Controller } from "react-hook-form";
import Loader from "../../Loader";
import { useTranslation } from "next-i18next";

function AddTeamInvitesForm({ tenant, onAddInvite }) {
  const { t } = useTranslation("common");
  const [processing, setProcessing] = useState(false);
  const [addEmails, setAddEmails] = useState([]);
  const [emailRequiredError, setEmailRequiredError] = useState(false);

  return (
    <>
      <p>
        {t(
          "tenant.admin.team.Add email addresses and send invitations to your team members to sign up and start using {{appName}} with you.",
          { tenantName: tenant.name, appName: process.env.NEXT_APP_NAME }
        )}
      </p>
      <p>
        {t(
          "tenant.admin.team.If you have more than one email address to add, separate the addresses with a comma."
        )}
      </p>
      <ReactMultiEmail
        placeholder={t("tenant.admin.team.Add Email Addresses")}
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
          {t("tenant.admin.team.At least one email address is required")}
        </div>
      ) : (
        <></>
      )}
      {processing ? (
        <Loader />
      ) : (
        <Button
          className={"btn-block-md-down mt-3"}
          // disabled={addEmails.length < 1}
          onClick={async () => {
            if (addEmails.length < 1) {
              setEmailRequiredError(true);
            } else {
              // add the invites
              setProcessing(true);
              const response = await api({
                method: "patch",
                url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-team/${tenant}`,
                params: {
                  addInviteEmailAddresses: addEmails,
                },
              });

              if (response.status >= 200 && response.status < 300) {
                // getTenant({ id: tenant._id });
                // router.push("/tenant/register/success");
                setProcessing(false);
                // notify user
                const notificationString =
                  addEmails.length === 1
                    ? t("tenant.admin.team.Invitation sent")
                    : `${addEmails.length} ${t(
                        "tenant.admin.team.invitations sent"
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
                return { success: false };
              }
            }
          }}
        >
          {t("tenant.admin.team.Send Invitations")}
        </Button>
      )}
    </>
  );
}

AddTeamInvitesForm.propTypes = {
  onSubmit: PropTypes.func,
  processing: PropTypes.bool,
  defaults: PropTypes.object,
};

export default AddTeamInvitesForm;
