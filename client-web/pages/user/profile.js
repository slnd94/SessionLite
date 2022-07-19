import Layout from "../../components/user/Layout";
import ProfileForm from "../../components/user/ProfileForm";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../utils/api";
import { useRouter } from "next/router";
import styles from "../../styles/User.module.scss";
import IconText from "../../components/IconText";

export default function Profile({ profile }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
    getAuth,
  } = useContext(AuthContext);
  const {
    state: { errorMessage },
    updateUserProfile,
    clearErrorMessage: clearUserErrorMessage,
  } = useContext(UserContext);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        {auth?.status === "SIGNED_IN" && profile ? (
          <>
            <div className="col-12">
              <h3 className={"title"}>{t("user.Your Profile")}</h3>
              <ProfileForm
                processing={processing}
                defaults={{
                  email: profile.email,
                  firstName: profile.name.given,
                  lastName: profile.name.family,
                }}
                onSubmit={async (data) => {
                  setProcessing(true);
                  const request = await updateUserProfile({
                    ...data,
                    id: auth.user._id,
                  });
                  if (request.success) {
                    // update the auth context, since user object likely needs update
                    getAuth();

                    // refresh with new data
                    await router.push(router.asPath);

                    // remove the loading indicator
                    setProcessing(false);

                    // notify user
                    toast(t(`user.User profile updated`), {
                      type: "success",
                    });
                  } else {
                    // remove preocessing loader
                    setProcessing(false);
                  }
                }}
              />
            </div>
          </>
        ) : auth?.status === "SIGNED_OUT" ? (
          <>
            <Link href="/auth/signin">{t("auth.Sign in")}</Link>
          </>
        ) : (
          null
        )}
        {errorMessage?.length ? (
          <Alert color="danger" fade={false}>
            {t(`user.${errorMessage}`)}
          </Alert>
        ) : null}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({
  locale,
  req: {
    cookies: { accessToken },
  },
}) => {
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/user-profile/me`,
    accessToken,
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      profile: response.data,
    },
  };
};
