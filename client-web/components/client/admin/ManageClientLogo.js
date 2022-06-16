import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import IconText from "../../IconText";
import Loader from "../../Loader";
import FilestackPicker from "../../FilestackPicker";
import api from "../../../utils/api";

const ManageClientLogo = ({ client, onUpdate }) => {
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
          <table style={{ width: "100%" }}>
            <tbody>
              <tr data-testid="">
                <td>
                  <h5 className={"title"}>{t("client.admin.details.Logo")}</h5>
                </td>
                <td className="text-end">
                  {editMode ? (
                    <Button
                      // className={"btn-block-md-down"}
                      color="danger"
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                  ) : (
                    <Button
                      color="default"
                      onClick={() => {
                        setEditMode(true);
                      }}
                    >
                      {t("client.admin.details.Upload logo")}
                    </Button>
                  )}
                </td>
              </tr>
              <tr data-testid="">
                <td colSpan="2">
                  {editMode ? (
                    <FilestackPicker
                      apikey={process.env.NEXT_FILESTACK_API_KEY}
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
                    <>
                      {client?.logo?.handle ? (
                        <img
                          src={`https://cdn.filestackcontent.com/${process.env.NEXT_FILESTACK_API_KEY}/resize=height:400,width:400,fit:clip/${client.logo.handle}`}
                        />
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
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </>
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
