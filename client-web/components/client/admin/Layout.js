import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as ClientContext } from "../../../context/ClientContext";
import useClientUserAuth from "../../../hooks/useClientUserAuth";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ManagementNav from "../../layout/ManagementNav";
import styles from "../../../styles/Client.module.scss";
import { useRouter } from "next/router";
import IconText from "../../IconText";
import { Button } from "reactstrap";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
    getClient,
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (client && client._id !== clientKey) {
      router.push(`/client/${client._id}`);
      getClient({ id: client._id });
    }

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
      slug: `details`,
      icon: "client",
      labelPills: t("Details"),
      labelTabs: t("Details"),
    },
    {
      slug: `users`,
      icon: "user",
      labelPills: t("Users"),
      labelTabs: t("Users"),
    },
    {
      slug: `schedule`,
      icon: "schedule",
      labelPills: t("Schedule"),
      labelTabs: t("Schedule"),
    },
    {
      slug: `templates`,
      icon: "template",
      labelPills: t("Templates"),
      labelTabs: t("Templates"),
    },
    {
      slug: `settings`,
      icon: "settings",
      labelPills: t("Settings"),
      labelTabs: t("Settings"),
    },
  ];

  return (
    <>
      {userAuthorized ? (
        <>
          <div className="row ms-md-n5">
            <div className="col-2 col-lg-3 col-md-4 pe-0 section-nav left-nav-md-up ms-n4">
              <h5 className="title d-none d-md-block">
                <IconText icon="clientAdmin" text={t("client.Admin")} />
              </h5>
              <ManagementNav
                routePrefix={`client/${clientKey}/admin`}
                labelPrefix="client.admin"
                subRoutes={subRoutes}
                className="mt-0"
              />
            </div>
            <div className="col-10 col-lg-9 col-md-8 pt-2 ms-3">{children}</div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
