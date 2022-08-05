import { useState, useContext } from "react";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import useTenantUserAuth from "../../../hooks/useTenantUserAuth";
import styles from "../../../styles/User.module.scss";
import Link from "next/link";
import { Alert, Button } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import IconText from "../../../components/IconText";
import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";

export default function VerifyEmail() {
  const { t } = useTranslation("common");
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
    getAuth,
    passwordReset,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [keyExpired, setKeyExpired] = useState(false);
  const router = useRouter();
  const { key } = router.query;

  return (
    <>
      <div className="row mt-4">
        {auth?.status === "SIGNED_OUT" ? (
          <>
            <div className="row mt-4">
              <div className="col-12 col-sm-6">
                <h3 className={"title"}>{t("auth.Reset Your Password")}</h3>
                {success ? (
                  <>
                    <div className="row mt-3">
                      <div className="col-12 d-flex justify-content-start">
                        <h5>
                          <IconText
                            icon="success"
                            iconContainerClass="display-6 text-secondary"
                            text={t("plan.Success!")}
                          />
                        </h5>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 d-flex justify-content-start fw-bold">
                        {t("auth.Your password has been reset")}
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 d-flex justify-content-center">
                        <Link href="/auth/signin" passHref>
                          <Button
                            className="btn-block"
                            size="md"
                            color="secondary"
                          >
                            {t("auth.Sign in now")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className={"title"}>
                      {t("auth.Enter your new password")}
                    </h5>
                    <ResetPasswordForm
                      processing={processing}
                      onSubmit={async (data) => {
                        if (data.password) {
                          setProcessing(true);
                          const response = await passwordReset({
                            password: data.password,
                            key,
                          });
                          if (response.passwordResetSuccess) {
                            setProcessing(false);
                            setSuccess(true);
                            setError(false);
                          } else {
                            setProcessing(false);
                            setSuccess(false);
                            setError(true);
                            if (response?.message === "key expired") {
                              setKeyExpired(true);
                            }
                          }
                        }
                      }}
                    />
                    {error ? (
                      <>
                        <Alert className="mt-4" color="danger" fade={false}>
                          <p className="fw-bold">
                            {t(
                              keyExpired
                                ? `auth.The password reset link in your email has expired.  You can try again to get a new link.`
                                : `auth.There was a problem resetting your password`
                            )}
                          </p>
                          <div className="mt-2">
                            <span style={{ marginRight: "10px" }}>
                              {t(`auth.Want to try again?`)}
                            </span>
                            <Link href="/auth/passwordreset">
                              {t("auth.Reset your password")}
                            </Link>
                          </div>
                        </Alert>
                      </>
                    ) : null}
                    <div className="mt-4">
                      <span style={{ marginRight: "10px" }}>
                        {t(`auth.Remember your password?`)}
                      </span>
                      <Link href="/auth/signin">{t("auth.Sign in")}</Link>
                    </div>
                    <div className="mt-2">
                      <span style={{ marginRight: "10px" }}>
                        {t(`auth.Need an account?`)}
                      </span>
                      <Link href="/auth/signup">{t("auth.Sign up")}</Link>
                    </div>
                  </>
                )}
              </div>
              <div className="col-sm-6 d-none d-sm-flex justify-content-center align-items-center">
                {tenant?.logo?.handle && fileAuth?.viewTenantLogo ? (
                  <TenantLogo
                    handle={tenant.logo.handle}
                    size="lg"
                    viewFileAuth={fileAuth?.viewTenantLogo}
                  />
                ) : (
                  <img src="/images/siteLogo.png" width="400" />
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
