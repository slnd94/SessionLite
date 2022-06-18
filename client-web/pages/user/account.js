import Layout from "../../components/user/Layout";
import AccountForm from "../../components/user/AccountForm";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import styles from "../../styles/User.module.scss";
import IconText from "../../components/IconText";

export default function Profile() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const {
    state: { errorMessage },
    updateUserAccount,
    clearErrorMessage: clearUserErrorMessage,
  } = useContext(UserContext);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    clearUserErrorMessage();
  }, []);

  return (
    <Layout>
      <div className="row mt-3 mt-md-0 ms-md-3">
        <div className="col-12">
          <h3 className={"title"}>
            <IconText icon="account" text={t("user.Your Account")} />
          </h3>
          {auth?.status === "SIGNED_IN" ? (
            <AccountForm
              processing={processing}
              defaults={{}}
              onSubmit={async (data) => {
                setProcessing(true);
                const request = await updateUserAccount({
                  ...data,
                  id: auth.user._id,
                });
                if (request.success) {
                  // remove processing loader
                  setProcessing(false);
                  // notify user
                  toast(t(`user.User account updated`), {
                    type: "success",
                  });
                } else {
                  // remove processing loader
                  setProcessing(false);
                }
              }}
            />
          ) : auth?.status === "SIGNED_OUT" ? (
            <>
              <Link href="/auth/signin">{t("auth.Sign in")}</Link>
            </>
          ) : (
            <></>
          )}
          {errorMessage?.length ? (
            <Alert color="danger" fade={false}>
              {t(`user.${errorMessage}`)}
            </Alert>
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
