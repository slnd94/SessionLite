import Layout from "../../../components/auth/Layout";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import { useState, useContext } from "react";
import TenantRegistrationForm from "../../../components/tenant/TenantRegistrationForm";
import Link from "next/link";
import { Alert, Progress } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../../styles/Tenant.module.scss";

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
  const { plan } = router.query;

  return (
    <>
      <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
        <div className="col-12">
          <Progress value={20} striped={true} color="primary" />
        </div>
      </div>
      <Layout>
        <>
          {auth?.status === "SIGNED_OUT" ? (
            <>
              <h3>
                {t("tenant.Register Your Business for {{appName}}", {
                  appName: process.env.NEXT_APP_NAME,
                })}
              </h3>
              <div className="mt-4">
                <TenantRegistrationForm
                  processing={processing}
                  onSubmit={async (data) => {
                    setProcessing(true);
                    const request = await registerTenant({
                      ...data,
                      ...(plan ? { tentativePlan: plan } : {}),
                    });
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
            </>
          ) : null}
          {auth?.status === "SIGNED_IN" ? (
            <>
              <h4 className="title">{t("tenant.Thanks for registering")}</h4>
              {!auth.user.verified ? (
                <p>
                  {t(
                    "user.account.verification.We need to verify your account. You should receive an email with a verification link."
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
          ) : null}
        </>
      </Layout>
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
