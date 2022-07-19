import { useState, useEffect, useContext } from "react";
import { Alert } from "reactstrap";
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
    <>
      {auth?.status === "SIGNED_OUT" ? (
        <div className="row mt-4">
          <div className="col-12 col-sm-6">
            <h5 className={"title"}>{t("auth.Sign Up")}</h5>
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
      ) : null}
      {auth?.status === "SIGNED_IN" ? (
        <>
          <h4 className="title">{t("auth.Thanks for signing up")}</h4>
          {!auth.user.isVerified ? (
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
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
