import { useState, useContext } from "react";
import Layout from "../../../../components/client/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as ClientContext } from "../../../../context/ClientContext";
import ClientDetailsForm from "../../../../components/client/admin/ClientDetailsForm";
import ManageClientLogo from "../../../../components/client/admin/ManageClientLogo";
import Loader from "../../../../components/Loader";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import confirm from "../../../../utils/confirm";
import IconText from "../../../../components/IconText";
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
    state: { auth, fileAuth },
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  return (
    <Layout>
      <div className="row mt-3 mt-md-0 ms-md-3">
        <div className="col-12">
          <h3 className={"title"}>
            <IconText icon="client" text={t("client.admin.Details")} />
          </h3>
          <ClientDetailsForm
            processing={processing}
            defaults={{
              name: client?.name,
            }}
            onSubmit={async (data) => {
              confirm(
                t(
                  "client.admin.details.Are you sure you want to update your details?"
                )
              ).then(async () => {
                setProcessing(true);
                const request = await updateClientDetails({
                  ...data,
                  id: clientKey,
                });
                if (request.success) {
                  // update the auth context, since user object likely needs update
                  getClient({ id: clientKey });

                  // remove the loading indicator
                  setProcessing(false);

                  // notify user
                  toast(t(`client.admin.details.Client details updated`), {
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
            <ManageClientLogo
              fileAuth={fileAuth}
              client={client}
              onUpdate={async () => {
                setProcessing(true);
                // get the updated client
                await getClient({ id: client._id });
                setProcessing(false);

                // notify user
                toast(t(`client.admin.details.Logo updated`), {
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
