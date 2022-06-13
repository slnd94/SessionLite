import Layout from "../../../components/client/Layout";
import ProfileForm from "../../../components/user/ProfileForm";
import PaginatedList from "../../../components/PaginatedList";
import { Context as ClientContext } from "../../../context/ClientContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import useClientUserAuth from "../../../hooks/useClientUserAuth";
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
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);
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
    if (!client || client._id !== clientKey) {
      // the context client needs to be set to match the clientKey
      getClient({ id: clientKey });
    }
    if (client && auth?.status) {
      if (auth.status === "SIGNED_OUT") {
        // redirect to sign in screen
        router.push({
          pathname: `/auth/signin`,
          query: {
            redirect: router.asPath,
          },
        });
      } else {
        const { isMember, isAdmin } = useClientUserAuth({ client, auth });
        if (isAdmin) {
          setUserAdminAuthorized(true);
        }
        if (isMember) {
          setUserAuthorized(true);
          if (
            client?._id === clientKey &&
            auth?.user?.client?._id === client?._id
          ) {
            let isSubscribed = true;
            fetchRooms({ skip: 0, limit: roomsPerPage }).catch(console.error);
            return () => (isSubscribed = false);
          }
        } else {
          // redirect to app root
          router.push({
            pathname: `/`,
          });
        }
      }
    }
  }, [client, auth]);

  return (
    <>
      {userAuthorized ? (
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
