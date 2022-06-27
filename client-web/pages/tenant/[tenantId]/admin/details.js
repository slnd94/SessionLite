import { useState, useContext } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import TenantDetailsForm from "../../../../components/tenant/admin/TenantDetailsForm";
import ManageTenantLogo from "../../../../components/tenant/admin/ManageTenantLogo";
import Loader from "../../../../components/Loader";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import confirm from "../../../../utils/confirm";
import IconText from "../../../../components/IconText";
import styles from "../../../../styles/Tenant.module.scss";

export default function Details() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
    updateTenantDetails,
    getTenant,
  } = useContext(TenantContext);
  const {
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12">
          <h3 className={"title"}>{t("tenant.admin.Details")}</h3>
          <TenantDetailsForm
            processing={processing}
            defaults={{
              name: tenant?.name,
            }}
            onSubmit={async (data) => {
              confirm(
                t(
                  "tenant.admin.details.Are you sure you want to update your details?"
                )
              ).then(async () => {
                setProcessing(true);
                const request = await updateTenantDetails({
                  ...data,
                  id: tenantId,
                });
                if (request.success) {
                  // update the auth context, since user object likely needs update
                  getTenant({ id: tenantId });

                  // remove the loading indicator
                  setProcessing(false);

                  // notify user
                  toast(t(`tenant.admin.details.Tenant details updated`), {
                    type: "success",
                  });
                } else {
                  // remove the loading indicator
                  setProcessing(false);
                }
              });
            }}
          />
        </div>
      </div>
      <div className="row mt-5 ms-md-3">
        <div className="col-12" style={{ height: "100px" }}>
          {processing ? (
            <Loader />
          ) : (
            <ManageTenantLogo
              fileAuth={fileAuth}
              tenant={tenant}
              onUpdate={async () => {
                setProcessing(true);
                // get the updated tenant
                await getTenant({ id: tenant._id });
                setProcessing(false);

                // notify user
                toast(t(`tenant.admin.details.Logo updated`), {
                  type: "success",
                });
              }}
            />
          )}
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
