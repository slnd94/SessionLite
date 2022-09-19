import { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import useTenantUserAuth from "../../../../hooks/useTenantUserAuth";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../../utils/api";
import { useRouter } from "next/router";
import IconText from "../../../../components/IconText";
import PaginatedList from "../../../../components/PaginatedList";
import styles from "../../../../styles/Tenant.module.scss";
import { Button } from "reactstrap";
import TemplateListItem from "../../../../components/tenant/admin/TemplateListItem";

export default function Users() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { tenantId } = router.query;
  const {
    state: { tenant },
  } = useContext(TenantContext);
  const {
    state: { auth },
  } = useContext(AuthContext);
  const [templates, setTemplates] = useState(null);
  const [requestingTemplates, setRequestingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templatesPerPage = 5;

  const fetchTemplates = async ({ skip, limit }) => {
    setRequestingTemplates(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-templates`,
      params: {
        tenant: tenantId,
        $skip: skip,
        $limit: limit,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setTemplates(response.data);
      setRequestingTemplates(false);
      return { success: true };
    } else {
      setTemplates(null);
      setRequestingTemplates(false);
      return { success: false };
    }
  };

  useEffect(() => {
    if (tenant && auth?.status === "SIGNED_IN") {
      const { isMember } = useTenantUserAuth({
        tenant: { _id: tenantId },
        auth,
      });
      if (isMember) {
        let isSubscribed = true;
        fetchTemplates({ skip: 0, limit: templatesPerPage }).catch(
          console.error
        );
        return () => (isSubscribed = false);
      }
    }
  }, []);

  return (
    <Layout>
      <div className="row mt-0 ms-md-3">
        <div className="col-12 col-md-6">
          <h3>{t("tenant.admin.Templates")}</h3>
        </div>
      </div>
      <div className="row">
        <div
          className={`${
            selectedTemplate ? "d-none" : ""
          } d-md-block col-md-6 col-lg-4`}
        >
          <div className="col-12 text-md-end mb-3">
            <Button
              className={"btn-block"}
              // className={"btn-block"}
              size="md"
              color="primary"
              onClick={() => {
                // setView("invites");
                setShowInviteForm(true);
              }}
            >
              <IconText
                icon="add"
                // iconPosition="end"
                text={t("tenant.admin.templates.Add New Template")}
              />
            </Button>
          </div>
          {templates ? (
            <div>
              <PaginatedList
                items={templates}
                itemComponent={
                  TemplateListItem
                }
                itemComponentCustomProps={{
                  selectedTemplate: selectedTemplate?._id 
                }}
                itemPropName={"template"}
                itemsListedName={t("tenant.templates")}
                itemsPerPage={templatesPerPage}
                // showPaginationTop
                showPaginationBottom
                hidePaginationForSinglePage
                requestItemsFunc={async ({ skip, limit }) => {
                  await fetchTemplates({ skip, limit });
                }}
                requestingItems={requestingTemplates}
                itemOnClick={(template) => {
                  setSelectedTemplate(template);
                }}
                showLink={true}
                t={t}
              />
            </div>
          ) : null}
        </div>
        <div
          className={`${
            !selectedTemplate ? "d-none" : ""
          } d-md-block col-md-6 col-lg-8 mt-3`}
        >
          {selectedTemplate ? (
            <>
              <h5>
                <IconText
                  className="d-inline-block d-md-none text-primary fw-bold fs-4 me-4"
                  icon="arrowLeft"
                  text=""
                  onClick={() => {
                    setSelectedTemplate(null);
                  }}
                />
                {selectedTemplate.name}
              </h5>
              <div>{selectedTemplate.description}</div>
            </>
          ) : (
            <>Select a template</>
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
