import Layout from "../../../components/user/Layout";
import ProfileForm from "../../../components/user/ProfileForm";
import { Context as ClientContext } from "../../../context/ClientContext";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../utils/api";
import { useRouter } from "next/router";
import styles from "../../../styles/User.module.scss";

export default function Client() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
    getClient,
  } = useContext(ClientContext);

  useEffect(() => {
    getClient({ id: clientKey });
  }, []);

  return (
    <>
      {client ? (
        <div>
          <div className="row mt-3 mt-md-0 ms-md-3">
            <div className="col-12">
              <h5 className={"title"}>{client.name}</h5>
              This is the client home route <br />
              <Link href={`/client/${clientKey}/admin`}>Client Admin</Link>
            </div>
          </div>
        </div>
      ) : (
        <></>
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
