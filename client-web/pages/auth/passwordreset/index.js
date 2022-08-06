import { useState, useEffect, useContext } from "react";
import Layout from "../../../components/auth/Layout";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as UserContext } from "../../../context/UserContext";
import styles from "../../../styles/Signout.module.scss";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ResetPasswordSendLinkForm from "../../../components/auth/ResetPasswordSendLinkForm";
import { Alert } from "reactstrap";

export default function SignOut() {
  const { t } = useTranslation("common");
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
    setPasswordReset,
    signout,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { clearUser } = useContext(UserContext);
  const { clearTenant } = useContext(TenantContext);

  useEffect(() => {
    clearAuthErrorMessage();
    signout();
    clearUser();
    clearTenant();
  }, []);

  return (
    <Layout>
      <>
        {auth?.status === "SIGNED_OUT" ? (
          <>
            <h3 className={"title"}>{t("auth.Reset Your Password")}</h3>
            <h5 className={"title"}>
              {t(
                "auth.Enter your email and we'll send you a link to reset your password"
              )}
            </h5>

            <ResetPasswordSendLinkForm
              processing={processing}
              onSubmit={async (data) => {
                if (data.email) {
                  setProcessing(true);
                  const request = await setPasswordReset({
                    email: data.email,
                  });
                  if (request.passwordResetSetSuccess) {
                    setProcessing(false);
                    setSuccess(true);
                    setError(false);
                  } else {
                    setProcessing(false);
                    setSuccess(false);
                    setError(true);
                  }
                }
              }}
            />
            {success ? (
              <>
                <Alert className="mt-4" color="success" fade={false}>
                  {t(
                    `auth.We have sent you an email with a password reset link.  Check your email for the link.`
                  )}
                </Alert>
              </>
            ) : null}
            {error ? (
              <>
                <Alert className="mt-4" color="danger" fade={false}>
                  {t(
                    `auth.There was a problem sending you the password reset link`
                  )}
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
        ) : null}
      </>
    </Layout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
