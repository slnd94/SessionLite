import { useState, useEffect, useContext } from "react";
import { Alert, Button } from "reactstrap";
import Image from "next/image";
import Layout from "../../components/auth/Layout";
import styles from "../../styles/Signin.module.scss";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import SignInForm from "../../components/auth/SignInForm";
import IconText from "../../components/IconText";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import TenantLogo from "../../components/tenant/TenantLogo";

export default function Signin() {
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth, errorMessage },
    signin,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();
  const { redirect, redirectQuery } = router.query;

  useEffect(() => {
    clearAuthErrorMessage();
  }, []);

  useEffect(() => {
    if (auth.status === "SIGNED_IN" && tenant) {
      router.push(`/tenant/${tenant._id}`);
    }
  }, [auth, tenant]);

  return (
    <>
      {/* only show the form if user is signed out */}
      {auth?.status === "SIGNED_OUT" ? (
        <Layout>
          <>
            {auth?.status === "SIGNED_OUT" ? (
              <>
                <h3 className={"title"}>{t("auth.Sign In")}</h3>
                <SignInForm
                  processing={processing}
                  onSubmit={async (data) => {
                    setProcessing(true);
                    const request = await signin(data);
                    if (request.success) {
                      setProcessing(false);
                      if (redirect) {
                        router.push({
                          pathname: redirect,
                          query: redirectQuery || {},
                        });
                      }
                    } else {
                      setProcessing(false);
                    }
                  }}
                />
                {errorMessage ? (
                  <Alert color="danger" fade={false}>
                    {t(`auth.There was a problem with your sign in`)}
                  </Alert>
                ) : null}
                <div className="mt-4">
                  <span style={{ marginRight: "10px" }}>
                    {t(`auth.Need an account?`)}
                  </span>
                  <Link href="/auth/signup">{t("auth.Sign up")}</Link>
                </div>
                <div className="mt-2">
                  <span style={{ marginRight: "10px" }}>
                    {t(`auth.Forgot your password?`)}
                  </span>
                  <Link href="/auth/passwordreset">
                    {t("auth.Reset your password")}
                  </Link>
                </div>
              </>
            ) : null}
          </>
        </Layout>
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
