import { useState, useEffect, useContext } from "react";
import { Alert } from "reactstrap";
import Layout from "../../components/auth/Layout";
import styles from "../../styles/Signup.module.scss";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import SignUpForm from "../../components/auth/SignUpForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import api from "../../utils/api";
import Link from "next/link";
import TenantLogo from "../../components/tenant/TenantLogo";

export default function Signup() {
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth, errorMessage },
    signup,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const { invite } = router.query;

  useEffect(() => {
    clearAuthErrorMessage();
    if (router.query.tenant) {
      console.log(
        "🚀 ~ file: signup.js ~ line 32 ~ useEffect ~ router.query.tenant",
        router.query.tenant
      );
      getTenant({ id: router.query.tenant });
    }
  }, []);

  return (
    <Layout>
      <>
        {auth?.status === "SIGNED_OUT" ? (
          <>
            <h3 className="title">{t("auth.Sign Up")}</h3>
            <SignUpForm
              processing={processing}
              onSubmit={async (data) => {
                setProcessing(true);

                const request = await signup({
                  ...data,
                  ...(tenant?._id ? { tenantId: tenant._id } : {}),
                  ...(invite ? { inviteId: invite } : {}),
                });

                // refresh with new data
                await router.push(router.asPath);

                setProcessing(false);
              }}
            />
            {errorMessage ? (
              <Alert color="danger" fade={false}>
                {t(`auth.There was a problem with your sign in`)}
              </Alert>
            ) : null}
            <div className="mt-4">
              <span style={{ marginRight: "10px" }}>
                {t(`auth.Already have an account?`)}
              </span>
              <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            </div>
          </>
        ) : null}
        {auth?.status === "SIGNED_IN" ? (
          <>
            <h3 className="title">{t("auth.Thanks for signing up")}</h3>
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
                  {tenant ? (
                    <>
                      <Link href={`/tenant/${tenant._id}`}>
                        {t("tenant.Tenant Home")}
                      </Link>
                      <br />
                    </>
                  ) : null}
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
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
