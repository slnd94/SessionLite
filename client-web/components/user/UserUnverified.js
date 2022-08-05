import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useTranslation } from "next-i18next";
import { Button, Alert, Progress } from "reactstrap";
import UpdateEmailForm from "../UpdateEmailForm";
import api from "../../utils/api";
import confirm from "../../utils/confirm";
import { toast } from "react-toastify";

const UserUnverified = ({}) => {
  const { t } = useTranslation("common");
  const {
    state: { auth },
    getAuth,
  } = useContext(AuthContext);
  const { setUserEmailVerification } = useContext(UserContext);
  const [processing, setProcessing] = useState(false);
  const [showEmailUpdateForm, setShowEmailUpdateForm] = useState(false);
  const [verificationResentSuccess, setVerificationResentSuccess] =
    useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
        <div className="col-12">
          <Progress value={40} striped={true} color="secondary" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <h3 className="title">{t("auth.Welcome!")}</h3>
          <p>
            {t("user.account.verification.We need to verify your account.")}
          </p>
          <p>
            {t(
              "user.account.verification.We have sent an email with a verification link to"
            )}
            :<span className="fw-bold ms-2">{auth?.user?.email}</span>
          </p>
            <div className="mt-5">
              {t("user.account.verification.Didn't get the email?")}
              <Button
                size="md"
                color="default"
                className="btn-block-md-down ms-md-3"
                onClick={() => {
                  setProcessing(true);
                  setUserEmailVerification({ id: auth.user._id }).then(
                    (res) => {
                      setProcessing(false);
                      if (res.verificationSetSuccess) {
                        toast(
                          t(
                            `user.account.verification.Verification mail re-sent. Check your email for the new link.`
                          ),
                          {
                            type: "success",
                          }
                        );
                      }
                    }
                  );
                }}
              >
                {t("user.account.verification.Send me a new email")}
              </Button>
            </div>

            {showEmailUpdateForm ? (
              <div className="mt-5">
                <UpdateEmailForm
                  emailFieldLabel={`${t(
                    "user.account.verification.Update email and send a new verification link to"
                  )}:`}
                  submitButtonLabel={t(
                    "user.account.verification.Update and send verification link"
                  )}
                  onSubmit={async (data) => {
                    confirm(
                      t(
                        "user.account.verification.Are you sure you want to change your email address?", 
                        { appName: process.env.NEXT_APP_NAME }
                      ), {
                        listItems: [
                          t("user.account.verification.Your account sign in email will be updated"),
                          t("user.account.verification.We will send you a new link to verify your account")
                        ]
                      }
                    ).then(async () => {
                    setProcessing(true);
                    const response = await api({
                      method: "patch",
                      url: `${process.env.NEXT_PUBLIC_API_URL}/user-accounts/${auth.user._id}`,
                      params: {
                        email: data.email,
                      },
                    });

                    if (response.status >= 200 && response.status < 300) {
                      setProcessing(false);
                      getAuth();
                      if (response.data.verificationSetSuccess) {
                        setShowEmailUpdateForm(false);
                        toast(
                          t(
                            `user.account.verification.Account email updated`
                          ),
                          {
                            type: "success",
                          }
                        );
                        toast(
                          t(
                            `user.account.verification.Verification mail re-sent. Check your email for the new link.`
                          ),
                          {
                            type: "success",
                          }
                        );
                      }
                      return { success: true };
                    } else {
                      setProcessing(false);
                      return { success: false };
                    }
                  })
                  }}
                  onCancel={() => {
                    setShowEmailUpdateForm(false);
                  }}
                  defaults={{
                    email: auth?.user?.email,
                  }}
                />
              </div>
            ) : (
              <div className="mt-5">
                {t("user.account.verification.Not the correct email address?")}
                <Button
                  size="md"
                  color="default"
                  className="btn-block-md-down ms-md-3"
                  onClick={() => {
                    setShowEmailUpdateForm(true);
                  }}
                >
                  {t("user.account.verification.Change the email address")}
                </Button>
              </div>
            )}
            {verificationResentSuccess ? (
              <Alert className="mt-4" color="success" fade={false}>
                {t(
                  `user.account.verification.Verification mail re-sent. Check your email for the new link.`
                )}
              </Alert>
            ) : null}
        </div>
      </div>
    </>
  );
};

UserUnverified.propTypes = {};

UserUnverified.defaultProps = {};

export default UserUnverified;
