import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useTranslation } from "next-i18next";
import { Button, Alert, Progress } from "reactstrap";
import Loader from "../Loader";

const UserUnverified = ({}) => {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const { setUserEmailVerification } = useContext(UserContext);
  const [processing, setProcessing] = useState(false);
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
            {t(
              "user.account.verification.We need to verify your account. We have sent an email to {{emailAddress}} with a verification link.",
              {
                emailAddress: auth?.user?.email
              }
            )}
          </p>
          {processing ? (
            <Loader />
          ) : (
            <Button
              size="md"
              className="btn-block-md-down"
              onClick={() => {
                setProcessing(true);
                setUserEmailVerification({ id: auth.user._id }).then((res) => {
                  setProcessing(false);
                  if (res.vertificationSetSuccess) {
                    setVerificationResentSuccess(true);
                    setTimeout(() => {
                      setVerificationResentSuccess(false);
                    }, 10000);
                  }
                });
              }}
            >
              {t("user.account.verification.Send me a new email")}
            </Button>
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
