import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Context as AuthContext } from "../../../context/AuthContext";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../utils/api";
import { getUserIP } from "../../../utils/ipUtils";
import { useRouter } from "next/router";
import styles from "../../../styles/Tenant.module.scss";
import PlanList from "../../../components/plan/PlanList";

export default function SelectPlan({ plans }) {
  const { t } = useTranslation("common");
  const {
    state: { auth, errorMessage: authErrorMessage },
    getAuth,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="row mt-4">
        <div className="col-12 col-sm-6">
          <h1 className={"title"}>{t("plan.Select Your Plan")}</h1>
        </div>
      </div>
      <PlanList
        plans={plans}
        onSelectPlan={(plan) => {
          console.log(
            "🚀 ~ file: selectplan.js ~ line 35 ~ SelectPlan ~ plan",
            plan
          );
          router.push({
            pathname: `/tenant/register`,
            query: {
              plan: plan._id,
            },
          });
        }}
      />
    </>
  );
}

export const getServerSideProps = async ({ locale, req }) => {
  const ip = getUserIP(req);
  const response = await api({
    method: "get",
    url: `${process.env.NEXT_PUBLIC_API_URL}/plans?$sort[index]=1`,
    ...(ip
      ? {
          headers: {
            client_ip: ip,
          },
        }
      : {}),
  });
  console.log(
    "🚀 ~ file: selectplan.js ~ line 60 ~ getServerSideProps ~ response",
    response
  );

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      plans: response.data.data,
    },
  };
};
