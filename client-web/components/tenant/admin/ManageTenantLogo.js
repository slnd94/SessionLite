import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import IconText from "../../IconText";
import Loader from "../../Loader";
import TenantLogo from "../TenantLogo";
import FilestackPicker from "../../FilestackPicker";
import confirm from "../../../utils/confirm";
import api from "../../../utils/api";

const ManageTenantLogo = ({ fileAuth, tenant, onUpdate }) => {
  const { t } = useTranslation("common");
  const [processing, setProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const updateTenantLogo = async ({ handle }) => {
    setProcessing(true);
    const response = await api({
      method: "patch",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-details/${tenant._id}`,
      params: {
        logo: { handle },
      },
    });
    if (
      response.status >= 200 &&
      response.status < 300 &&
      response.data.success
    ) {
      // callback
      onUpdate();
      // remove the loading indicator
      setProcessing(false);
      setEditMode(false);
    }
  };

  const removeTenantLogo = async () => {
    setProcessing(true);
    const response = await api({
      method: "patch",
      url: `${process.env.NEXT_PUBLIC_API_URL}/tenant-details/${tenant._id}`,
      params: {
        logo: {},
      },
    });
    if (
      response.status >= 200 &&
      response.status < 300 &&
      response.data.success
    ) {
      // callback
      onUpdate();
      // remove the loading indicator
      setProcessing(false);
      // setEditMode(false);
    }
  };

  return (
    <>
      {processing ? (
        <Loader />
      ) : (
        <>
          <div className="row m-0 p-0">
            <div className="col-12 m-0 p-0">
              <h5 className={"title"}>{t("tenant.admin.details.Logo")}</h5>
            </div>
          </div>
          <div className="row m-0 p-0">
            <div className="col-12 col-lg-5 m-0 p-0 pt-3 d-flex justify-content-center">
              {tenant?.logo?.handle && fileAuth?.viewTenantLogo ? (
                <TenantLogo
                  handle={tenant.logo.handle}
                  size="md"
                  viewFileAuth={fileAuth?.viewTenantLogo}
                />
              ) : (
                <div className=" text-light">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    <IconText
                      icon="image"
                      iconContainerClass="icon-large"
                      text={t("tenant.admin.details.No logo selected")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-5 m-0 p-0">
              <Button
                className={"btn-block"}
                color="default"
                onClick={() => {
                  setEditMode(true);
                }}
              >
                {t("tenant.admin.details.Upload logo")}
              </Button>
              {tenant?.logo?.handle ? (
                <Button
                  className={"btn-block"}
                  color="default"
                  onClick={() => {
                    confirm(
                      t(
                        "tenant.admin.details.Are you sure you want to remove this logo?"
                      )
                    ).then(async () => {
                      removeTenantLogo();
                    });
                  }}
                >
                  {t("tenant.admin.details.Remove logo")}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}

      {editMode && fileAuth?.uploadTenantLogo ? (
        <FilestackPicker
          apikey={process.env.NEXT_FILESTACK_API_KEY}
          viewMode="overlay"
          clientOptions={{
            security: fileAuth.uploadTenantLogo,
          }}
          pickerOptions={{
            fromSources: ["local_file_system"],
            accept: ["image/jpeg", "image/png"],
            onClose: () => {
              setEditMode(false);
            },
          }}
          onSuccess={(result) => {
            if (result.filesUploaded.length > 0) {
              updateTenantLogo({
                handle: result.filesUploaded[0].handle,
              });
            }
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};

ManageTenantLogo.propTypes = {
  onFileSelect: PropTypes.func,
  accept: PropTypes.string,
  allowMultiple: PropTypes.bool,
  icon: PropTypes.string,
  text: PropTypes.string,
  acceptedFileTypesText: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  t: PropTypes.func,
};

ManageTenantLogo.defaultProps = {
  icon: "file",
  text: "Click or drag your file here",
};

export default ManageTenantLogo;
