import { useEffect, useState, useContext } from "react";
import { Context as TenantContext } from "../context/TenantContext";
import { Context as AuthContext } from "../context/AuthContext";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import api from "../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export default function Home() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
  } = useContext(TenantContext);

  return (
    <div className="row">
      <div className="col-12">
        <h3 className="title">
          {t("index.Welcome to")}&nbsp;{process.env.NEXT_APP_NAME}
        </h3>

        {auth?.status === "SIGNED_OUT" ? (
          <div>
            <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            <br />
            <Link href="/auth/signup">{t("auth.Sign up")}</Link>
            <br />
            <Link href="/products">{t("products.Products")}</Link>
            <br />
            <Link href="/tenant/register">
              {t("tenant.Register Your Business")}
            </Link>
            <br />
            <Link href="/plans/checkout">
              {t("tenant.Plan Checkout")}
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
