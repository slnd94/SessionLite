import { useState, useEffect, useContext } from "react";
import { Alert } from "reactstrap";
import styles from "../../styles/Signup.module.scss";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import SignUpForm from "../../components/auth/SignUpForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Link from "next/link";
import ClientLogo from "../../components/client/ClientLogo";

export default function Signup() {
  const {
    state: { client },
  } = useContext(ClientContext);
  const {
    state: { auth, fileAuth, errorMessage },
    signup,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    clearAuthErrorMessage();
  }, []);

  return (
    <>
      {auth?.status === "SIGNED_OUT" ? (
        <div className="row mt-4">
          <div className="col-12 col-sm-6">
            <div className="section-box">
              <h5 className={"title"}>{t("auth.Sign Up")}</h5>
              <SignUpForm
                processing={processing}
                onSubmit={async (data) => {
                  setProcessing(true);
                  
                  const request = await signup({
                    ...data,
                    clientId: client?._id,
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
          </div>
          <div className="col-sm-6 d-none d-sm-flex justify-content-center align-items-center">
            {client?.logo?.handle && fileAuth?.viewClientLogo ? (
              <ClientLogo
                handle={client.logo.handle}
                size="lg"
                viewFileAuth={fileAuth?.viewClientLogo}
              />
            ) : (
              <img src="/images/siteLogo.png" width="400" />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
      {auth?.status === "SIGNED_IN" ? (
        <>
          <h4 className="title">{t("auth.Thanks for signing up")}</h4>
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
