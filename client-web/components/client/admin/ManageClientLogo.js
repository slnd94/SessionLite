import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import IconText from "../../IconText";
import Loader from "../../Loader";
import ClientLogo from "../ClientLogo";
import FilestackPicker from "../../FilestackPicker";
import confirm from "../../../utils/confirm";
import api from "../../../utils/api";

const ManageClientLogo = ({ fileAuth, client, onUpdate }) => {
  const { t } = useTranslation("common");
  const [processing, setProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const updateClientLogo = async ({ handle }) => {
    setProcessing(true);
    const response = await api({
      method: "patch",
      url: `${process.env.NEXT_PUBLIC_API_URL}/client-details/${client._id}`,
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

  const removeClientLogo = async () => {
    setProcessing(true);
    const response = await api({
      method: "patch",
      url: `${process.env.NEXT_PUBLIC_API_URL}/client-details/${client._id}`,
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
              <h5 className={"title"}>{t("client.admin.details.Logo")}</h5>
            </div>
          </div>
          <div className="row m-0 p-0">
            <div className="col-12 col-lg-6 m-0 p-0 pt-3">
              {client?.logo?.handle && fileAuth?.viewClientLogo ? (
                <ClientLogo
                  handle={client.logo.handle}
                  size="lg"
                  viewFileAuth={fileAuth?.viewClientLogo}
                />
              ) : (
                <div
                  className=" text-light"
                  style={{
                    paddingTop: "50px",
                    paddingBottom: "50px",
                  }}
                >
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
                      text={t("client.admin.details.No logo selected")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-6 m-0 p-0">
              <Button
                className={"btn-block-md-down"}
                color="default"
                onClick={() => {
                  setEditMode(true);
                }}
              >
                {t("client.admin.details.Upload logo")}
              </Button>
              <br />
              {client?.logo?.handle ? (
                <Button
                  className={"btn-block-md-down mt-1"}
                  color="default"
                  onClick={() => {
                    confirm(
                      t(
                        "client.admin.details.Are you sure you want to remove this logo?"
                      )
                    ).then(async () => {
                      removeClientLogo();
                    });
                  }}
                >
                  {t("client.admin.details.Remove logo")}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}

      {editMode && fileAuth?.uploadClientLogo ? (
        <FilestackPicker
          apikey={process.env.NEXT_FILESTACK_API_KEY}
          viewMode="overlay"
          clientOptions={{
            security: fileAuth.uploadClientLogo,
          }}
          pickerOptions={{
            fromSources: ["local_file_system"],
            accept: ["image/jpeg", "image/png"],
            onClose: () => {
              setEditMode(false);
            },
          }}
          onSuccess={(result) => {
            console.log(
              "🚀 ~ file: ManageClientLogo.js ~ line 114 ~ ManageClientLogo ~ result",
              result
            );
            if (result.filesUploaded.length > 0) {
              updateClientLogo({
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

ManageClientLogo.propTypes = {
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

ManageClientLogo.defaultProps = {
  icon: "file",
  text: "Click or drag your file here",
};

export default ManageClientLogo;
