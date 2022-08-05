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
      {auth?.status ? (
        <>
          <div className="row">
            <div className="col-12">
              <h3 className="title">
                {t("index.Welcome to")}&nbsp;{process.env.NEXT_APP_NAME}
              </h3>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              {auth?.status === "SIGNED_OUT" ? (
                <Link href="/tenant/register">
                  <a>
                    <Button>{t("tenant.Start for free")}</Button>
                  </a>
                </Link>
              ) : (
                <>
                  {tenant ? (
                    <Link href={`/tenant/${tenant._id}`}>
                      <a>
                        <Button>{t("tenant.Home")}</Button>
                      </a>
                    </Link>
                  ) : (
                    null
                  )}
                  <br />
                  <Link href="/products">{t("products.Products")}</Link>
                </>
              )}
            </div>
          </div>
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
