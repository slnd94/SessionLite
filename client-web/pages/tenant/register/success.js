import { Context as TenantContext } from "../../../context/TenantContext";
import { Context as AuthContext } from "../../../context/AuthContext";
import { useState, useContext } from "react";
import TenantRegistrationForm from "../../../components/tenant/TenantRegistrationForm";
import Link from "next/link";
import { Alert, Progress } from "reactstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../../styles/Tenant.module.scss";
import IconText from "../../../components/IconText";

export default function RegisterSuccess() {
  const { t } = useTranslation("common");
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth, errorMessage: authErrorMessage },
    getAuth,
    clearErrorMessage: clearAuthErrorMessage,
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();



  const SectionLink = ({ icon, title, description, route }) => {
    return (
      <div className="row list-item-box mb-3 d-flex justify-content-center">
        <Link href={route}>
          <div className="col-12" style={{ cursor: "pointer" }}>
            <div className="row">
              <div className="col-12 text-start">
                <h5>
                  <IconText
                    icon={icon}
                    iconContainerClass="display-6 text-secondary"
                    text={title}
                  />
                </h5>
              </div>
              <div className="col-12 text-start">
                {description}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="row mt-2 pt-2" style={{ opacity: "90%" }}>
        <div className="col-12">
          <Progress value={100} striped={true} color="secondary" />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 d-flex justify-content-center">
          <h1>
            <IconText
              icon="success"
              iconContainerClass="display-4 text-secondary"
              text={t("plan.Success!")}
            />
          </h1>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 d-flex justify-content-center fw-bold">
          <h3>{t("plan.Your plan is all set up.  What's next?")}</h3>
        </div>
      </div>
      <div className="row mt-3 d-flex justify-content-center">
        <div className="col-12 col-md-6 text-center">
          <SectionLink
            icon="home"
            title={t("tenant.Home")}
            route={`/tenant/${tenant?._id}`}
            description="Lorem Ipsum skjsdhfsdkfjhds fk jdhs djfh eufhwe fdfudhf dsfksjdhf ksdjfsdkfudhf kjfdhdfks jdfhsdkfjh "
          />
          <SectionLink
            icon="tenantAdmin"
            title={t("tenant.Admin")}
            route={`/tenant/${tenant?._id}/admin/details`}
            description="Lorem Ipsum skjsdhfsdkfjhds fk jdhs djfh eufhwe fdfudhf dsfksjdhf ksdjfsdkfudhf kjfdhdfks jdfhsdkfjh "
          />
          <SectionLink
            icon="tenant"
            title={t("tenant.admin.Details")}
            route={`/tenant/${tenant?._id}/admin/details`}
            description="Lorem jd djdjIpsum djfh eufhwe fdfudhf dsfksjdhf ksdjfsdkfudhf kjfdhdfksjdf hsdkfjh "
          />
          <SectionLink
            icon="users"
            title={t("tenant.admin.Users")}
            route={`/tenant/${tenant?._id}/admin/users`}
            description="Lorem Ipsum djfhd jfj dsf djfh eufhwe fdfudhf dsfksjdhf ksdjfsdkfudhf kjfdhdfksj dfhsdkfjh "
          />
        </div>
      </div>
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
