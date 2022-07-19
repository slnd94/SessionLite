import { useState, useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as UserContext } from "../../context/UserContext";
import styles from "../../styles/Signout.module.scss";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function SignOut() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
    signout,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
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
          <h4 className="title">{t("auth.You are signed out")}</h4>
          <h6>{t(`auth.What's next?`)}</h6>
          <p>
            <Link href="/">{t("Browse content")}</Link>
            <br />
            <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            <br />
            <Link href="/auth/signup">{t("auth.Sign up")}</Link>
          </p>
        </>
      ) : (
        null
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
