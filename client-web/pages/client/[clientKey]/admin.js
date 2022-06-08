import Layout from "../../../components/client/Layout";
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

export default function ClientAdmin() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
    getClient,
  } = useContext(ClientContext);

  return (
    <>
      <Layout>
        <div>
          This is the client admin route <br />
          <Link href={`/client/${clientKey}`}>{t("client.Client Home")}</Link>
        </div>
      </Layout>
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
