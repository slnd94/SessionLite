import { useState, useContext } from "react";
import Layout from "../../../../components/client/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as ClientContext } from "../../../../context/ClientContext";
import ClientDetailsForm from "../../../../components/client/admin/ClientDetailsForm";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import styles from "../../../../styles/Client.module.scss";

export default function Details() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { clientKey } = router.query;
  const {
    state: { client },
    updateClientDetails,
    getClient,
  } = useContext(ClientContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  return (
    <Layout>
      <div className="row mt-3 mt-md-0 ms-md-3">
        <div className="col-12">
          <h5 className={"title"}>{t("client.admin.Details")}</h5>
          <ClientDetailsForm
            processing={processing}
            defaults={{
              name: client?.name,
            }}
            onSubmit={async (data) => {
              setProcessing(true);
              const request = await updateClientDetails({
                ...data,
                id: clientKey,
              });
              if (request.success) {
                // update the auth context, since user object likely needs update
                getClient({ id: clientKey });

                // refresh with new data
                // await router.push(router.asPath);

                // remove the loading indicator
                setProcessing(false);

                // notify user
                toast(t(`client.admin.details.Client details updated`), {
                  type: "success",
                });
              } else {
                // remove preocessing loader
                setProcessing(false);
              }
            }}
          />
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
