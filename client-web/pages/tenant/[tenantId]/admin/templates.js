import { useContext, useState, useEffect } from "react";
import Layout from "../../../../components/tenant/admin/Layout";
import { Context as AuthContext } from "../../../../context/AuthContext";
import { Context as TenantContext } from "../../../../context/TenantContext";
import useTenantUserAuth from "../../../../hooks/useTenantUserAuth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import api from "../../../../utils/api";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loader from "../../../../components/Loader";
import confirm from "../../../../utils/confirm";
import IconText from "../../../../components/IconText";
import PaginatedList from "../../../../components/PaginatedList";
import styles from "../../../../styles/Tenant.module.scss";
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import TemplateListItem from "../../../../components/tenant/admin/TemplateListItem";
import TemplateDetailsForm from "../../../../components/tenant/admin/TemplateDetailsForm";

export default function Templates() {
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
  const [requestingSelectedTemplate, setRequestingSelectedTemplate] =
    useState(false);
  const [templatesRequestItemsSignal, setTemplatesRequestItemsSignal] =
    useState(null);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [processingTemplateDetails, setProcessingTemplateDetails] =
    useState(false);
  const templatesPerPage = 5;

  const fetchTemplates = async ({ skip, limit, search }) => {
    setRequestingTemplates(true);
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-templates`,
      params: {
        tenant: tenantId,
        $skip: skip,
        $limit: limit,
        ...(search ? { search } : {})
      },
    });

    if (response.status >= 200 && response.status < 300) {
      // setTemplates(response.data);
      setRequestingTemplates(false);
      return { success: true, data: response.data };
    } else {
      // setTemplates(null);
      setRequestingTemplates(false);
      return { success: false };
    }
  };

  const selectTemplate = async (templateId) => {
    setRequestingSelectedTemplate(true);
    if (selectedTemplate?._id !== templateId) {
      setSelectedTemplate(null);
    }
    const response = await api({
      method: "get",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-templates/${tenantId}`,
      params: {
        template: templateId,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      setSelectedTemplate(response.data);
      setRequestingSelectedTemplate(false);
      return { success: true };
    } else {
      setSelectedTemplate(null);
      setRequestingSelectedTemplate(false);
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
        fetchTemplates({ skip: 0, limit: templatesPerPage })
          .then((response) => {
            if (isSubscribed) {
              if (response.success) {
                setTemplates(response.data);
              } else {
                setTemplates(null);
              }
            }
          })
          .catch(console.error);
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
          } d-md-block col-md-6 col-lg-5`}
        >
          {/* {templates?.total === 0 ? (
            <div className="section-box d-flex justify-content-center align-items-center text-light">
              {t("tenant.admin.templates.You have not yet added any templates")}
            </div>
          ) : null} */}

          <div className="col-12 text-md-end mb-3">
            <Button
              className={"btn-block"}
              size="md"
              color="primary"
              onClick={() => {
                setShowNewTemplateForm(true);
              }}
            >
              <IconText
                icon="add"
                text={t("tenant.admin.templates.Add a Template")}
              />
            </Button>
          </div>

          {templates ? (
            <div>
              <PaginatedList
                items={templates}
                itemComponent={TemplateListItem}
                itemComponentCustomProps={{
                  selectedTemplate: selectedTemplate?._id,
                }}
                itemPropName={"template"}
                itemsListedName={t("tenant.templates")}
                itemsPerPage={templatesPerPage}
                showPaginationBottom
                hidePaginationForSinglePage
                requestItemsFunc={async ({ skip, limit, search }) => {
                  const response = await fetchTemplates({ skip, limit, search });
                  if (response.success) {
                    setTemplates(response.data);
                  } else {
                    setTemplates(null);
                  }
                  // setTemplates(templates)
                }}
                requestingItems={requestingTemplates}
                requestItemsSignal={templatesRequestItemsSignal}
                showSearch={true}
                searchPlaceholder={t("tenant.admin.templates.Search")}
                itemOnClick={(template) => {
                  selectTemplate(template._id);
                }}
                showLink={true}
                t={t}
              />
            </div>
          ) : null}
          {templates && !templates.data?.length ? (
            <h6 className="mt-4">
              {t("tenant.admin.templates.No templates found")}
            </h6>
          ) : null}
        </div>
        <div
          className={`${
            !selectedTemplate ? "d-none" : ""
          } d-md-block col-md-6 col-lg-7 mt-3`}
        >
          {requestingSelectedTemplate ? <Loader /> : null}
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
              <TemplateDetailsForm
                processing={processingTemplateDetails}
                defaults={selectedTemplate}
                onSubmit={async (data) => {
                  confirm(
                    t(
                      "tenant.admin.templates.Are you sure you want to update this template?"
                    )
                  ).then(async () => {
                    setProcessingTemplateDetails(true);
                    const response = await api({
                      method: "patch",
                      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-templates/${tenantId}`,
                      params: {
                        updateTemplate: {
                          id: selectedTemplate._id,
                          ...data,
                        },
                      },
                    });

                    if (response.status >= 200 && response.status < 300) {
                      setProcessingTemplateDetails(false);
                      // signal the component to reset the pagination
                      setTemplatesRequestItemsSignal(Date.now());
                      selectTemplate(selectedTemplate._id);
                      toast(
                        t(`tenant.admin.templates.Template details updated`),
                        {
                          type: "success",
                        }
                      );
                      return { success: true };
                    } else {
                      setProcessingTemplateDetails(false);
                      toast(
                        t(
                          `tenant.admin.templates.There was a problem updating your template`
                        ),
                        {
                          type: "danger",
                        }
                      );
                      return { success: false };
                    }
                  });
                }}
              />
            </>
          ) : (
            <div
              className="d-none d-md-flex justify-content-center align-items-start"
              style={{ paddingTop: "min(150px, 40%)" }}
            >
              {templates?.total > 0 ? (
                <h5 className="text-light">
                  <IconText
                    icon="template"
                    text={t("tenant.admin.templates.Select a template")}
                  />
                </h5>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <Offcanvas isOpen={showNewTemplateForm} direction="end" keyboard={true}>
        <OffcanvasHeader
          toggle={() => {
            setShowNewTemplateForm(false);
          }}
        >
          {t("tenant.admin.templates.Add a Template")}
        </OffcanvasHeader>
        <OffcanvasBody>
          <TemplateDetailsForm
            processing={processingTemplateDetails}
            defaults={{
              name: "",
              description: "",
            }}
            onSubmit={async (data) => {
              confirm(
                t(
                  "tenant.admin.templates.Are you sure you want to add this template?"
                )
              ).then(async () => {
                setProcessingTemplateDetails(true);
                const response = await api({
                  method: "patch",
                  url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-templates/${tenantId}`,
                  params: {
                    addTemplate: data,
                  },
                });

                if (response.status >= 200 && response.status < 300) {
                  setProcessingTemplateDetails(false);
                  selectTemplate(response.data._id);
                  // signal the component to reset the pagination
                  setTemplatesRequestItemsSignal(Date.now());
                  setShowNewTemplateForm(false);
                  toast(
                    t(`tenant.admin.templates.Template added successfully`),
                    {
                      type: "success",
                    }
                  );
                  return { success: true };
                } else {
                  setProcessingTemplateDetails(false);
                  toast(
                    t(
                      `tenant.admin.templates.There was a problem adding your template`
                    ),
                    {
                      type: "danger",
                    }
                  );
                  return { success: false };
                }
              });
            }}
          />
        </OffcanvasBody>
      </Offcanvas>
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
