import { useContext } from "react";
import Layout from "../../../../components/client/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as ClientContext } from "../../../../context/ClientContext";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../../../styles/Client.module.scss";

export default function Users() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <h5 className={"title"}>{t("client.admin.Users")}</h5>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
