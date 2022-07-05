import { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import api from "../../../../utils/api";
import IconText from "../../../../components/IconText";
import styles from "../../../../styles/Tenant.module.scss";
import UserList from "../../../../components/user/UserList";
import Loader from "../../../../components/Loader";
import { Button } from "reactstrap";

export default function Users() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const usersPerPage = 50;

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-6">
          <h3 className={"title"}>{t("tenant.admin.Users")}</h3>
        </div>
        <div className="col-6 text-end">
          <Button
            // className={"btn-block"}
            size="md"
            color="secondary"
            onClick={() => {
              console.log("hi");
            }}
          >
            <IconText
              icon="add"
              iconPosition="end"
              text={t("tenant.admin.users.Invite Users")}
            />
          </Button>
        </div>
      </div>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          <UserList
            tenant={tenantId}
            itemsPerPage={usersPerPage}
            onSelectUser={() => {}}
            t={t}
          />
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
