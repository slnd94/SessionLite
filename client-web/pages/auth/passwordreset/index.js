import { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as UserContext } from "../../../context/UserContext";
import styles from "../../../styles/Signout.module.scss";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ResetPasswordSendLinkForm from "../../../components/auth/ResetPasswordSendLinkForm";

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
  const { clearUser } = useContext(UserContext);
  const { clearTenant } = useContext(TenantContext);

  useEffect(() => {
    clearAuthErrorMessage();
    signout();
    clearUser();
    clearTenant();
  }, []);

  return (
    <>
      {auth?.status === "SIGNED_OUT" ? (
        <>
          <div className="row mt-4">
            <div className="col-12 col-sm-6">
              <h3 className={"title"}>{t("auth.Reset Your Password")}</h3>
              {success ? (
                <></>
              ) : (
                <>
                  <h5 className={"title"}>
                    {t(
                      "auth.Enter your email and we'll send you a link to reset your password"
                    )}
                  </h5>

                  <ResetPasswordSendLinkForm
                    processing={processing}
                    onSubmit={async (data) => {
                      // console.log("🚀 ~ file: passwordreset.js ~ line 63 ~ onSubmit={ ~ data", data)
                      if (data.email) {
                        setProcessing(true);
                        const request = await setPasswordReset({
                          email: data.email,
                        });
                        if (request.passwordResetSetSuccess) {
                          setProcessing(false);
                          setSuccess(true);
                        } else {
                          setProcessing(false);
                          setSuccess(false);
                        }
                      }
                    }}
                  />
                </>
              )}
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
