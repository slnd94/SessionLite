import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import useClientUserAuth from "../../hooks/useClientUserAuth";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Client.module.scss";
import ClientLogo from "./ClientLogo";
import IconText from "../IconText";
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
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);
  const [userAdminAuthorized, setUserAdminAuthorized] = useState(false);

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
        const { isMember, isAdmin } = useClientUserAuth({ client, auth });
        if (isMember) {
          setUserAuthorized(true);
        } else {
          // redirect to app root
          router.push({
            pathname: `/`,
          });
        }
        if (isAdmin) {
          setUserAdminAuthorized(true);
        }
      }
    }
  }, [client, auth]);

  return (
    <>
      {userAuthorized ? (
        <div className="row">
          <div className="col-12">{children}</div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
