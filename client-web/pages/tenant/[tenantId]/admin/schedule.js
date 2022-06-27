import { useContext } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import IconText from "../../../../components/IconText";
import styles from "../../../../styles/Tenant.module.scss";

export default function Users() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
  } = useContext(AuthContext);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          <h3 className={"title"}>{t("tenant.admin.Schedule")}</h3>
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
