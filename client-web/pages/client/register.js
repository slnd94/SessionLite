import Layout from "../../components/user/Layout";
import ProfileForm from "../../components/user/ProfileForm";
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useState, useEffect, useContext } from "react";
import RegisterForm from "../../components/client/RegisterForm";
import Link from "next/link";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../utils/api";
import { useRouter } from "next/router";
import styles from "../../styles/User.module.scss";

export default function Register() {
  const { t } = useTranslation("common");
  const router = useRouter();
//   const { clientKey } = router.query;

  return (
    <>
      Client Registration
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
