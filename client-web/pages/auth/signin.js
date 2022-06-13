import { useState, useEffect, useContext } from "react";
import { Alert } from "reactstrap";
import styles from "../../styles/Signin.module.scss";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import SignInForm from "../../components/auth/SignInForm";
import IconText from "../../components/IconText";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signin() {
  const {
    state: { client },
  } = useContext(ClientContext);
  const {
    state: { auth, errorMessage },
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

  return (
    <>
      {auth?.status === "SIGNED_OUT" ? (
        <div className="row mt-4">
          <div className="col-12 col-sm-6">
            <div className="section-box">
              <h5 className={"title"}>{t("auth.Sign In")}</h5>
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
          <h4 className="title">{t("auth.You are signed in")}</h4>
          <h6>{t(`auth.What's next?`)}</h6>
          <p>
            {client ? (
              <>
                <Link href={`/client/${client._id}`}>
                  {t("client.Client Home")}
                </Link>
                <br />
              </>
            ) : (
              <></>
            )}
            <Link href="/user/profile">{t("user.Manage your profile")}</Link>
            <br />
            <Link href="/">{t("Browse content")}</Link>
          </p>
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
