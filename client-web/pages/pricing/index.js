// import Layout from '../components/user/Layout'
import { Context as AuthContext } from "../../context/AuthContext";
import { Context as UserContext } from "../../context/UserContext";
import { useEffect, useContext, useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import api from "../../utils/api";
import styles from "../../styles/Checkout.module.scss";
import PaddleLoader from "../../components/commerce/PaddleLoader";
import { Button } from "reactstrap";
import supportedCountries from "../../utils/commerce/supportedCountries.json";
import SelectPlan from "../../components/plan/SelectPlan";

export default function Checkout() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [countries, setCountries] = useState({});

  return (
    <div className="row mt-4">
      <div className="col-12">
        <SelectPlan
          onSelectPlan={(plan) => {
            router.push({
              pathname: `/tenant/register`,
              query: {
                plan: plan._id,
              },
            });
          }}
        />
      </div>
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
