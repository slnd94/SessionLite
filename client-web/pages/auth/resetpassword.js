import { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as UserContext } from "../../context/UserContext";
import styles from "../../styles/Signout.module.scss";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ResetPasswordSendLinkForm from "../../components/auth/ResetPasswordSendLinkForm";

export default function SignOut() {
  const { t } = useTranslation("common");
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
    signout,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
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
          {/* <h4 className="title">{t("auth.Reset Your Password")}</h4> */}
          <div className="row mt-4">
            <div className="col-12 col-sm-6">
              <h3 className={"title"}>{t("auth.Reset Your Password")}</h3>
              <h5 className={"title"}>
                {t(
                  "auth.Enter your email and we'll send you a link to reset your password"
                )}
              </h5>

              <ResetPasswordSendLinkForm
                processing={processing}
                onSubmit={async (data) => {
                  setProcessing(true);
                  const request = await signin(data);
                  if (request.success) {
                    setProcessing(false);
                    // if (redirect) {
                    //   router.push({
                    //     pathname: redirect,
                    //     query: redirectQuery || {},
                    //   });
                    // }
                  } else {
                    setProcessing(false);
                  }
                  Ï;
                }}
              />
              {/* {errorMessage ? (
                <Alert color="danger" fade={false}>
                  {t(`auth.There was a problem with your sign in`)}
                </Alert>
              ) : null} */}
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
