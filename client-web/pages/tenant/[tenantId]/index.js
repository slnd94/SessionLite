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
  const [rooms, setRooms] = useState(null);
  const [requestingRooms, setRequestingRooms] = useState(false);
  const roomsPerPage = 2;

  const fetchRooms = async ({ skip, limit }) => {
    setRequestingRooms(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-rooms`,
      params: {
        tenant: tenantId,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setRequestingRooms(false);
      return { success: true, data: response.data };
    } else {
      setRequestingRooms(false);
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
        fetchRooms({ skip: 0, limit: roomsPerPage })
          .then((response) => {
            if (isSubscribed) {
              if (response.success) {
                setRooms(response.data);
              } else {
                setRooms(null);
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
          {rooms ? (
            <>
              <PaginatedList
                items={rooms}
                itemComponent={({ room }) => {
                  return (
                    <div
                      className={`row section-box`}
                      onClick={() => (onClick ? onClick() : null)}
                    >
                      <div className="col-12">
                        <h5>{room.name}</h5>
                      </div>
                    </div>
                  );
                }}
                itemPropName={"room"}
                itemsListedName={t("tenant.rooms")}
                itemsPerPage={roomsPerPage}
                showPaginationTop
                showPaginationBottom
                hidePaginationForSinglePage
                requestItemsFunc={async ({ skip, limit }) => {
                  await fetchRooms({ skip, limit });
                }}
                requestingItems={requestingRooms}
                // itemNavRoute={"/room"}
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
