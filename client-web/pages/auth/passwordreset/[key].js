import { useState, useEffect, useContext } from "react";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as UserContext } from "../../../context/UserContext";
import useTenantUserAuth from "../../../hooks/useTenantUserAuth";
import styles from "../../../styles/User.module.scss";
import Link from "next/link";
import { Alert, Button, Progress } from "reactstrap";
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
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const router = useRouter();
  const { key } = router.query;
  console.log("🚀 ~ file: [key].js ~ line 30 ~ VerifyEmail ~ key", key)

  return (
    <>
      <div className="row mt-4">
        {auth?.status === "SIGNED_OUT" ? (
          <>
            <div className="row mt-4">
              <div className="col-12 col-sm-6">
                <h3 className={"title"}>{t("auth.Reset Your Password")}</h3>
                <h5 className={"title"}>{t("auth.Enter your new password")}</h5>
                <ResetPasswordForm
                  processing={processing}
                  onSubmit={async (data) => {
                    console.log(
                      "🚀 ~ file: passwordreset.js ~ line 63 ~ onSubmit={ ~ data",
                      data
                    );
                    if (data.password) {
                      setProcessing(true);
                      const request = await passwordReset({
                        password: data.password,
                        key,
                      });
                      if (request.passwordResetSuccess) {
                        setProcessing(false);
                      } else {
                        setProcessing(false);
                      }
                    }
                  }}
                />
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
