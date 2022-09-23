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

export default function Brand() {
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
        <div className="col-12 col-md-6">
          <h3 className={"title"}>{t("tenant.admin.Brand")}</h3>
        </div>
      </div>
      <div className="row mt-0 ms-md-3">
        <div className="col-12 col-md-6 mb-5">
          <h5 className={"title"}>{t("tenant.admin.brand.Details")}</h5>
          <TenantDetailsForm
            processing={processing}
            defaults={{
              name: tenant?.name,
            }}
            onSubmit={async (data) => {
              confirm(
                t(
                  "tenant.admin.brand.Are you sure you want to update your details?"
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
                  toast(t(`tenant.admin.brand.Details updated`), {
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
        <div className="col-12 col-md-6">
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
                toast(t(`tenant.admin.brand.Logo updated`), {
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
