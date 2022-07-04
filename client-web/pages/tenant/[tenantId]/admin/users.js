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

export default function Users() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const [users, setUsers] = useState(null);
  const [requestingUsers, setRequestingUsers] = useState(null);
  const usersPerPage = 5;

  const fetchUsers = async ({ skip, limit }) => {
    setRequestingUsers(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-users`,
      params: {
        tenant: tenantId,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setUsers(response.data);
      setRequestingUsers(false);
      return { success: true };
    } else {
      setUsers(null);
      setRequestingUsers(false);
      return { success: false };
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    fetchUsers({ skip: 0, limit: usersPerPage }).catch(console.error);
    return () => (isSubscribed = false);
  }, []);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          <h3 className={"title"}>{t("tenant.admin.Users")}</h3>
          {requestingUsers ? (
            <Loader />
          ) : (
            <>{users ? <UserList
              users={users}
              itemsPerPage={usersPerPage}
              onSelectUser={() => {
                
              }}
              t={t} /> : <></>}</>
          )}
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
