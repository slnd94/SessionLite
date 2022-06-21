// import Layout from '../components/user/Layout'
import { Context as AuthContext } from "../../../context/AuthContext";
import { Context as UserContext } from "../../../context/UserContext";
import { useEffect, useContext, useState } from "react";
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../utils/api";
import styles from "../../../styles/Checkout.module.scss";
import PaddleLoader from "../../../components/commerce/PaddleLoader";
import { Button } from "reactstrap";
import supportedCountries from "../../../utils/commerce/supportedCountries.json"

export default function Checkout() {
  const { t } = useTranslation("common");
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [countries, setCountries] = useState({});

  useEffect(() => {
    // console.log(supportedCountries);
    Paddle.Checkout.open({
      product: 30972,
      method: "inline",
      frameTarget: "paddle-inline-checkout",
      // frameInitialHeight: 416,
      frameStyle: 'width:100%;',
      email: auth?.user?.email
    });

    setCountries(supportedCountries);
  }, []);

  return (
    <div className="row">
    <div className="col-6">hi</div>
      <div className="col-6">
        <div className="paddle-inline-checkout pt-5"></div>
        <ul>
          {Object.keys(countries).map(country => (
            <li key={countries[country]}>
              {country} is {countries[country]}
            </li>
          ))}
        </ul>
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
