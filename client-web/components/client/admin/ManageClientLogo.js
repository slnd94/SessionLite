import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import IconText from "../../IconText";
import Loader from "../../Loader";
import ClientLogo from "../ClientLogo";
import FilestackPicker from "../../FilestackPicker";
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

  return (
    <>
      {processing ? (
        <Loader />
      ) : (
        <>
          <div className="row m-0 p-0">
            <div className="col-12 col-md-6 m-0 p-0">
              <h5 className={"title"}>{t("client.admin.details.Logo")}</h5>
            </div>
            <div className="col-12 col-md-6 m-0 p-0 text-end">
              {editMode ? (
                <Button
                  className={"btn-block-md-down"}
                  color="danger"
                  onClick={() => {
                    setEditMode(false);
                  }}
                >
                  {t("Cancel")}
                </Button>
              ) : (
                <Button
                  className={"btn-block-md-down"}
                  color="default"
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  {t("client.admin.details.Upload logo")}
                </Button>
              )}
            </div>
          </div>
          <div className="row m-0 p-0">
            <div className="col-12 m-0 p-0 pt-3 text-center justify-content-center">
              {client?.logo?.handle && fileAuth?.viewImages ? (
                <ClientLogo handle={client.logo.handle} size="lg" viewFileAuth={fileAuth?.viewImages} />
              ) : (
                <div
                  className="section-box text-light"
                  style={{
                    paddingTop: "50px",
                    paddingBottom: "50px",
                    width: "400px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    <IconText
                      icon="image"
                      iconContainerClass="icon-large"
                      text={t("client.admin.details.No logo selected")}
                      style={{ backgroundPosition: "50% 0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {editMode ? (
        <FilestackPicker
          apikey={process.env.NEXT_FILESTACK_API_KEY}
          viewMode="overlay"
          clientOptions={{
            security: {
              policy: "eyJleHBpcnkiOjE2NTU0Mzg0MDAsImNhbGwiOlsicGljayIsInN0b3JlIiwiY29udmVydCJdfQ==",
              signature: "1bf26ec091a508b03518d7559a5747f3cdce481898b4554dba3d586ddbcc61e8"
            }
          }}
          pickerOptions={{
            accept: ["image/jpeg", "image/png"],
          }}
          onSuccess={(result) => {
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
