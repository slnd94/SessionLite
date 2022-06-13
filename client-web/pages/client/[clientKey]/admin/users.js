import Layout from "../../../../components/client/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as ClientContext } from "../../../../context/ClientContext";
import useClientUserAuth from "../../../../hooks/useClientUserAuth";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../../utils/api";
import { useRouter } from "next/router";
import styles from "../../../../styles/Client.module.scss";

export default function Profile({ profile }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [userAuthorized, setUserAuthorized] = useState(false);

  useEffect(() => {
    if (client && auth?.status) {
      const { isAdmin } = useClientUserAuth({ client, auth });
      if (isAdmin) {
        setUserAuthorized(true)
      } else {
        // redirect to client home route
        router.push({
          pathname: `/client/${auth.user.client._id}`,
        });
      }
    }
  }, [client, auth]);

  return (
    <div>
      {userAuthorized ? (
        <Layout>
          <div>
            <div className="row mt-3 mt-md-0 ms-md-3">
              {auth?.status === "SIGNED_IN" ? (
                <>
                  <div className="col-12">
                    <div className="section-box">
                      <h5 className={"title"}>{t("client.admin.Users")}</h5>
                    </div>
                  </div>
                </>
              ) : auth?.status === "SIGNED_OUT" ? (
                <>
                  <Link href="/auth/signin">{t("auth.Sign in")}</Link>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Layout>
      ) : (
        <></>
      )}
    </div>
  );
}

export const getServerSideProps = async ({
  locale,
  req: {
    cookies: { accessToken },
  },
}) => {
  // const response = await api({
  //   method: "get",
  //   url: `${process.env.NEXT_PUBLIC_API_URL}/user-profile/me`,
  //   accessToken,
  // });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // profile: response.data,
    },
  };
};
