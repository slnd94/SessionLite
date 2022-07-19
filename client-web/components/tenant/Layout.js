import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { Context as TenantContext } from "../../context/TenantContext";
import { Context as AuthContext } from "../../context/AuthContext";
import useTenantUserAuth from "../../hooks/useTenantUserAuth";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Tenant.module.scss";
import TenantLogo from "./TenantLogo";
import IconText from "../IconText";
import { Button } from "reactstrap";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
    getTenant,
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (tenant && tenant._id !== tenantId) {
      router.push(`/tenant/${tenant._id}`);
      getTenant({ id: tenant._id });
    }

    if (!tenant || tenant._id !== tenantId) {
      // the context tenant needs to be set to match the tenantId
      getTenant({ id: tenantId });
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
        const { isMember } = useTenantUserAuth({ tenant, auth });
        if (isMember) {
          setUserAuthorized(true);
        } else {
          // User is signed in but in the wrong tenant
          // Redirect to app root
          router.push({
            pathname: `/`,
          });
        }
      }
    }
  }, [tenant, auth]);

  return (
    <>
      {userAuthorized ? (
        <div className="row">
          <div className="col-12">{children}</div>
        </div>
      ) : (
        null
      )}
    </>
  );
}
