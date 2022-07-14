import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useTranslation } from "next-i18next";
import { Button, Alert, Progress } from "reactstrap";
import Loader from "../Loader";
import UpdateEmailForm from "../UpdateEmailForm";

const UserUnverified = ({}) => {
  const { t } = useTranslation("common");
  const {
    state: { auth },
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
          {processing ? (
            <Loader />
          ) : (
            <>
              <Button
                size="md"
                color="default"
                className="btn-block-md-down"
                onClick={() => {
                  setProcessing(true);
                  setUserEmailVerification({ id: auth.user._id }).then(
                    (res) => {
                      setProcessing(false);
                      if (res.vertificationSetSuccess) {
                        setVerificationResentSuccess(true);
                        setTimeout(() => {
                          setVerificationResentSuccess(false);
                        }, 10000);
                      }
                    }
                  );
                }}
              >
                {t("user.account.verification.Send me a new email")}
              </Button>

              {showEmailUpdateForm ? (
                <div>
                  <UpdateEmailForm
                    onSubmit={(data) => {
                      console.log(
                        "🚀 ~ file: UserUnverified.js ~ line 79 ~ UserUnverified ~ data",
                        data
                      );
                    }}
                    defaults={{
                      email: auth?.user?.email,
                    }}
                  />
                  <Button
                    size="md"
                    color="default"
                    className="btn-block-md-down ms-lg-3"
                    onClick={() => {
                      setShowEmailUpdateForm(false);
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              ) : (
                <Button
                  size="md"
                  color="default"
                  className="btn-block-md-down ms-lg-3"
                  onClick={() => {
                    setShowEmailUpdateForm(true);
                  }}
                >
                  {t("user.account.verification.Change the email address")}
                </Button>
              )}
              {verificationResentSuccess ? (
                <Alert className="mt-4" color="success" fade={false}>
                  {t(
                    `user.account.verification.Verification mail re-sent. Check your email for the new link.`
                  )}
                </Alert>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
};

UserUnverified.propTypes = {};

UserUnverified.defaultProps = {};

export default UserUnverified;
