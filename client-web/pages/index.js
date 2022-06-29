import { useEffect, useState, useContext } from "react";
import { Context as TenantContext } from "../context/TenantContext";
import { Context as AuthContext } from "../context/AuthContext";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import api from "../utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Button } from "reactstrap";

export default function Home() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { tenant },
  } = useContext(TenantContext);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h3 className="title">
            {t("index.Welcome to")}&nbsp;{process.env.NEXT_APP_NAME}
          </h3>
        </div>
        {/* {auth?.status === "SIGNED_OUT" ? (
          <div className="col-12 col-md-6 d-flex justify-content-md-end align-content-top">
            <Link href="/tenant/register">
              <Button>{t("tenant.Try it Free")}</Button>
            </Link>
          </div>
        ) : (
          <></>
        )} */}
      </div>

      <div className="row mt-5">
        <div className="col-12">
          {auth?.status === "SIGNED_OUT" ? (
            <>MKTG Content here</>
          ) : (
            <>
              {tenant ? (
                <Link href={`/tenant/${tenant._id}`}>
                  <Button>{t("tenant.Home")}</Button>
                </Link>
              ) : (
                <></>
              )}
            </>
          )}
          <br />
          <Link href="/products">{t("products.Products")}</Link>
        </div>
      </div>
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
