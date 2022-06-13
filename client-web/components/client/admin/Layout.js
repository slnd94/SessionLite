import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as ClientContext } from "../../../context/ClientContext";
import useClientUserAuth from "../../../hooks/useClientUserAuth";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ManagementNav from "../../layout/ManagementNav";
import styles from "../../../styles/Client.module.scss";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
    getClient
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (!client || client._id !== clientKey) {
      // the context client needs to be set to match the clientKey
      getClient({ id: clientKey });
    }
    
    // ensure the user is authorized to be here, and redirect them if not authorized
    if (client && auth?.status) {
      if (auth.status === "SIGNED_OUT") {
        // redirect to sign in screen
        router.push({
          pathname: `/auth/signin`,
          query: {
            redirect: router.asPath,
          },
        });
      } else {
        const { isAdmin } = useClientUserAuth({ client, auth });
        if (isAdmin) {
          setUserAuthorized(true);
        } else {
          // user is not authorized client admin. Redirect to client home
          router.push({
            pathname: `/client/${clientKey}`,
          });
        }
      }
    }
  }, [client, auth]);

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
    },
  ];

  return (
    <>
      {userAuthorized ? (
        <>
          <h1 className="title">{client.name}</h1>
          <div className="row">
            <div className="col-12 mb-3">
              <Link href={`/client/${clientKey}`}>
                {t("client.Client Home")}
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-md-2 mb-3">
              <ManagementNav
                routePrefix={`client/${clientKey}/admin`}
                labelPrefix="client.admin"
                subRoutes={subRoutes}
              />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
