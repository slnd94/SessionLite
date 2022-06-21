import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useContext } from "react";
import { Context as AuthContext } from "../../context/AuthContext";

export default function SignOut() {
  const { t } = useTranslation("common");
  const {
    state: { auth }, getAuth,
  } = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      getAuth();
    }, 1000)
  }, []);

  return (
    <div>
      <h5 className="title">Thank You</h5>
    </div>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};
