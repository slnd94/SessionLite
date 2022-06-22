import { useContext, useState, useEffect } from "react";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as TenantContext } from "../../../context/TenantContext";
import useTenantUserAuth from "../../../hooks/useTenantUserAuth";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import ManagementNav from "../../layout/ManagementNav";
import styles from "../../../styles/Tenant.module.scss";
import { useRouter } from "next/router";
import IconText from "../../IconText";
import { Button } from "reactstrap";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantKey } = router.query;
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (tenant && tenant._id !== tenantKey) {
      router.push(`/tenant/${tenant._id}`);
      getTenant({ id: tenant._id });
    }

    if (!tenant || tenant._id !== tenantKey) {
      // the context tenant needs to be set to match the tenantKey
      getTenant({ id: tenantKey });
    }

    // ensure the user is authorized to be here, and redirect them if not authorized
    if (tenant && auth?.status) {
      if (auth.status === "SIGNED_OUT") {
        // redirect to sign in screen
        router.push({
          pathname: `/auth/signin`,
          query: {
            redirect: router.asPath,
          },
        });
      } else {
        const { isAdmin } = useTenantUserAuth({ tenant, auth });
        if (isAdmin) {
          setUserAuthorized(true);
        } else {
          // user is not authorized tenant admin. Redirect to tenant home
          router.push({
            pathname: `/tenant/${tenantKey}`,
          });
        }
      }
    }
  }, [tenant, auth]);

  const subRoutes = [
    {
      slug: `details`,
      icon: "tenant",
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
      slug: `clients`,
      icon: "client",
      labelPills: t("Clients"),
      labelTabs: t("Clients"),
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
      slug: `plan`,
      icon: "plan",
      labelPills: t("Plan"),
      labelTabs: t("Plan"),
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
            <div className="col-2 col-lg-3 col-md-4 pe-0 section-nav left-nav-md-up ms-n4 ms-md-n3">
              <h5 className="title d-none d-md-block">
                <IconText icon="tenantAdmin" text={t("tenant.Admin")} />
              </h5>
              <ManagementNav
                routePrefix={`tenant/${tenantKey}/admin`}
                labelPrefix="tenant.admin"
                subRoutes={subRoutes}
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
