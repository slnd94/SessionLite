import { useContext, useEffect } from "react";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as ClientContext } from "../../../context/ClientContext";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ManagementNav from "../../layout/ManagementNav";
import { getFullName } from "../../../helpers/nameHelpers";
import styles from "../../../styles/User.module.scss";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { client },
  } = useContext(ClientContext);
  const { clientKey } = router.query;

  const subRoutes = [
    {
      slug: `info`,
      icon: "about",
      labelPills: t("Info"),
      labelTabs: t("Info"),
    },
    {
      slug: `users`,
      icon: "user",
      labelPills: t("Users"),
      labelTabs: t("Users"),
    }
  ];

  return (
    <>
      {auth?.status === "SIGNED_IN" && client ? (
        <>
          <h1 className="title">{client.name}</h1>
          <div>
            <div className="row">
              <div className="col-md-3 mb-3">
                <ManagementNav routePrefix={`client/${clientKey}/admin`} labelPrefix="client.admin" subRoutes={subRoutes} />
              </div>
              <div className="col-md-9">{children}</div>
            </div>
          </div>
        </>
      ) : auth?.status === "SIGNED_OUT" ? (
        <>
          <Link href="/auth/signin">{t("auth.Sign in")}</Link>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
