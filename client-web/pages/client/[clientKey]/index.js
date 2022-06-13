import Layout from "../../../components/client/Layout";
import PaginatedList from "../../../components/PaginatedList";
import { Context as ClientContext } from "../../../context/ClientContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import useClientUserAuth from "../../../hooks/useClientUserAuth";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
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
    state: { client }
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAdminAuthorized, setUserAdminAuthorized] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [requestingRooms, setRequestingRooms] = useState(false);
  const roomsPerPage = 2;

  const fetchRooms = async ({ skip, limit }) => {
    setRequestingRooms(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/client-rooms`,
      params: {
        client: clientKey,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setRooms(response.data);
      setRequestingRooms(false);
      return { success: true };
    } else {
      setRooms(null);
      setRequestingRooms(false);
      return { success: false };
    }
  };

  useEffect(() => {
    if (client && auth?.status === "SIGNED_IN") {
      const { isMember, isAdmin } = useClientUserAuth({ client: { _id: clientKey }, auth });
      if (isAdmin) {
        setUserAdminAuthorized(true);
      }
      if (isMember) {
        let isSubscribed = true;
        fetchRooms({ skip: 0, limit: roomsPerPage }).catch(console.error);
        return () => (isSubscribed = false);
      }
    }
  }, [client, auth]);

  return (
    <Layout>
      <div>
        This is the client home route <br />
        {userAdminAuthorized ? (
          <Link href={`/client/${clientKey}/admin/info`}>
            {t("client.Client Admin")}
          </Link>
        ) : (
          <></>
        )}
        {rooms ? (
          <>
            <PaginatedList
              items={rooms}
              itemComponent={({ room }) => {
                return (
                  <div
                    className={`row list-item-box`}
                    onClick={() => (onClick ? onClick() : null)}
                  >
                    <div className="col-12">
                      <h5>{room.name}</h5>
                    </div>
                  </div>
                );
              }}
              itemPropName={"room"}
              itemsListedName={t("client.rooms")}
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
        ) : (
          <></>
        )}
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
