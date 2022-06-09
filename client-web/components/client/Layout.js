import { useContext, useEffect } from "react";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { getFullName } from "../../helpers/nameHelpers";
import { useRouter } from "next/router";
import styles from "../../styles/User.module.scss";

export default function Layout({ children }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { client },
    getClient
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const { clientKey } = router.query;

  useEffect(() => {
    if (auth?.status === "SIGNED_IN" && ((client && auth.user.client._id !== client._id) || (auth.user.client._id !== clientKey))) {
      // the clientKey, the user's client and the context client are not all a match
      // redirect to the user's client home screen
      router.push({
        pathname: `/client/${auth.user.client._id}`
      }); 
    }

    if (!client || client._id !== clientKey) {
      // the context client needs to be set to match the clientKey
      getClient({ id: clientKey });
    }
  }, [client]);

  useEffect(() => {
    if (auth?.status === "SIGNED_OUT" ) {
      // user is not signed in
      // redirect to the sign in screen
      router.push({
        pathname: "/auth/signin",
        query: {
          redirect: router.asPath,
        },
      });
    }

    if (auth?.status === "SIGNED_IN" && client && auth.user.client._id !== client._id) {
      // the user's client and the context client are not a match
      // redirect to the user's client home screen
      router.push({
        pathname: `/client/${auth.user.client._id}`
      });
      getClient({ id: clientKey })
    }
  }, [auth]);

  return (
    <>
      {client && auth?.status === "SIGNED_IN" && auth.user.client._id === client._id ? (
        // the user's client and the context client are a match
        <>
          <h1 className="title">{client.name}</h1>
          <div>{children}</div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
