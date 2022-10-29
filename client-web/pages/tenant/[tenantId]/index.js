import Layout from "../../../components/tenant/Layout";
import PaginatedList from "../../../components/PaginatedList";
import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import useTenantUserAuth from "../../../hooks/useTenantUserAuth";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../utils/api";
import { formatDateLong, formatTime } from "../../../helpers/dateHelpers";
import { useRouter } from "next/router";
import styles from "../../../styles/User.module.scss";

export default function Tenant() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userSessions, setUserSessions] = useState(null);
  const [requestingUserSessions, setRequestingUserSessions] = useState(false);
  const userSessionsPerPage = 2;

  const fetchUserSessions = async ({ skip, limit }) => {
    setRequestingUserSessions(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-sessions`,
      params: {
        tenant: tenantId,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setRequestingUserSessions(false);
      return { success: true, data: response.data };
    } else {
      setRequestingUserSessions(false);
      return { success: false };
    }
  };

  useEffect(() => {
    if (tenant && auth?.status === "SIGNED_IN") {
      const { isMember } = useTenantUserAuth({
        tenant: { _id: tenantId },
        auth,
      });
      if (isMember) {
        let isSubscribed = true;
        fetchUserSessions({ skip: 0, limit: userSessionsPerPage })
          .then((response) => {
            if (isSubscribed) {
              if (response.success) {
                setUserSessions(response.data);
              } else {
                setUserSessions(null);
              }
            }
          })
          .catch(console.error);
        return () => (isSubscribed = false);
      }
    }
  }, [tenant, auth]);

  return (
    <Layout>
      <div className="row">
        <div className="col-12">
          <h3>{tenant.name}</h3>
          {userSessions ? (
            <>
              <PaginatedList
                items={userSessions}
                itemComponent={({ session }) => {
                  return (
                    <div
                      className={`row section-box`}
                      onClick={() => (onClick ? onClick() : null)}
                    >
                      <div className="col-12">
                        <h5>{session.name}</h5>
                      </div>
                      <div className="col-12">
                        {session.description}
                      </div>
                      <div className="col-12">
                        {formatDateLong(session.start)}
                      </div>
                      <div className="col-12">
                        {formatTime(session.start)} - {formatTime(session.end)}
                      </div>
                    </div>
                  );
                }}
                itemPropName={"session"}
                itemsListedName={t("tenant.userSessions")}
                itemsPerPage={userSessionsPerPage}
                showPaginationTop
                showPaginationBottom
                hidePaginationForSinglePage
                requestItemsFunc={async ({ skip, limit }) => {
                  fetchUserSessions({ skip, limit })
                    .then((response) => {
                      if (response.success) {
                        setUserSessions(response.data);
                      } else {
                        setUserSessions(null);
                      }
                    })
                    .catch(console.error);
                }}
                requestingItems={requestingUserSessions}
                // itemNavRoute={"/session"}
                showLink={true}
                t={t}
                // onRef={ref => (this.paginatedList = ref)}
              />
            </>
          ) : null}
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
