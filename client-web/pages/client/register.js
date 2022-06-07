import Layout from "../../components/user/Layout";
import ProfileForm from "../../components/user/ProfileForm";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useState, useEffect, useContext } from "react";
import ClientRegistrationForm from "../../components/client/ClientRegistrationForm";
import Link from "next/link";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../utils/api";
import { useRouter } from "next/router";
import styles from "../../styles/User.module.scss";

export default function Register() {
  const { t } = useTranslation("common");
  const {
    state: { auth, errorMessage },
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
              <h5 className={"title"}>{t("client.Register Your Business")}</h5>
              <ClientRegistrationForm
                processing={processing}
                onSubmit={async (data) => {
                  setProcessing(true);
                  // const request = await signup(data);
                  setProcessing(false);
                }}
              />
              {errorMessage ? (
                <Alert color="danger" fade={false}>
                  {t(`client.There was a problem with your registration`)}
                </Alert>
              ) : null}
              <div className="mt-4">
                <span style={{ marginRight: "10px" }}>
                  {t(`client.Already registered?`)}
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
          <h4 className="title">{t("client.Thanks for registering")}</h4>
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
