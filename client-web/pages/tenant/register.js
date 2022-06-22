import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { useState, useContext } from "react";
import TenantRegistrationForm from "../../components/tenant/TenantRegistrationForm";
import Link from "next/link";
import { Alert } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Tenant.module.scss";

export default function Register() {
  const { t } = useTranslation("common");
  const {
    state: { tenant, errorMessage: tenantErrorMessage },
    registerTenant,
    clearErrorMessage: clearTenantErrorMessage,
  } = useContext(TenantContext);
  const {
    state: { auth, errorMessage: authErrorMessage },
    getAuth,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  return (
    <>
      {auth?.status === "SIGNED_OUT" ? (
        <div className="row mt-4">
          <div className="col-12 col-sm-6">
            <div className="section-box">
              <h5 className={"title"}>{t("tenant.Register Your Business")}</h5>
              <TenantRegistrationForm
                processing={processing}
                onSubmit={async (data) => {
                  setProcessing(true);
                  const request = await registerTenant(data);
                  getAuth();

                  // refresh with new data
                  await router.push(router.asPath);
                  
                  setProcessing(false);
                }}
              />
              {tenantErrorMessage ? (
                <Alert color="danger" fade={false}>
                  {t(`tenant.There was a problem with your registration`)}
                </Alert>
              ) : null}
              <div className="mt-4">
                <span style={{ marginRight: "10px" }}>
                  {t(`tenant.Already registered?`)}
                </span>
                <Link href="/auth/signin">{t("auth.Sign in")}</Link>
              </div>
            </div>
          </div>
          <div className="col-sm-6 d-none d-sm-block">
            Branded image/artwork here
          </div>
        </div>
      ) : (
        <></>
      )}
      {auth?.status === "SIGNED_IN" ? (
        <>
          <h4 className="title">{t("tenant.Thanks for registering")}</h4>
          {!auth.user.isVerified ? (
            <p>
              {t(
                "user.account.verification.We will need to verify your account. You should receive an email with a verification link."
              )}
            </p>
          ) : (
            <>
              <h6>{t(`auth.What's next?`)}</h6>
              <p>
                <Link href="/user/profile">
                  {t("user.Manage your profile")}
                </Link>
                <br />
                <Link href="/">{t("Browse content")}</Link>
              </p>
            </>
          )}
        </>
      ) : (
        <></>
      )}
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
