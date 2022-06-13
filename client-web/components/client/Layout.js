import { useContext, useEffect } from "react";
import { Context as ClientContext } from "../../context/ClientContext";
import { Context as AuthContext } from "../../context/AuthContext";
import { useTranslation } from "next-i18next";
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
    if (!client || client._id !== clientKey) {
      // the context client needs to be set to match the clientKey
      getClient({ id: clientKey });
    }
  }, [client]);

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
