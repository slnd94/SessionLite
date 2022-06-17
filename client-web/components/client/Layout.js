import React, { useContext, useState, useEffect } from "react";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import useClientUserAuth from "../../hooks/useClientUserAuth";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../styles/Client.module.scss";
import ClientLogo from "./ClientLogo";

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
        const { isMember } = useClientUserAuth({ client, auth });
        if (isMember) {
          setUserAuthorized(true);
        } else {
          // redirect to app root
          router.push({
            pathname: `/`,
          });
        }
      }
    }
  }, [client, auth]);

  return (
    <>
      {userAuthorized ? (
        <>
          <h3 className="title">
            {client?.logo?.handle && fileAuth?.viewClientLogo ? (
              <ClientLogo
                handle={client.logo.handle}
                size="sm"
                className="me-3"
                viewFileAuth={fileAuth?.viewClientLogo}
              />
            ) : (
              <></>
            )}
            {client.name}
          </h3>
          <div>{children}</div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
