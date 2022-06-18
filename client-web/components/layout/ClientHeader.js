import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Button } from "reactstrap";
import IconText from "../IconText";
import { useTranslation } from "next-i18next";
import ClientLogo from "../client/ClientLogo";
import styles from "../../styles/Header.module.scss";

function ClientHeader({ client, admin, fileAuth }) {
  const { t } = useTranslation("common");
  return (
    <div className="row m-0 py-2 client-header sticky-top">
      <div className="d-flex col-11 justify-content-md-start align-items-center">
        <h5 className="m-0">
          <Link href={`/client/${client._id}`}>
            <span style={{ cursor: "pointer" }}>
              {client?.logo?.handle && fileAuth?.viewClientLogo ? (
                <ClientLogo
                  handle={client.logo.handle}
                  size="xs"
                  className="me-3"
                  viewFileAuth={fileAuth?.viewClientLogo}
                />
              ) : (
                <></>
              )}
              <span className="d-none d-md-inline-block pt-2">
                {client.name}
              </span>
            </span>
          </Link>
        </h5>
      </div>
      {admin ? (
        <div className="d-flex col-1 justify-content-end align-items-center">
          <h5 className="m-0">
            <Link href={`/client/${client._id}/admin/details`}>
              <Button color="default">
                <IconText icon="clientAdmin" text={t("client.Admin")} />
              </Button>
            </Link>
          </h5>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

ClientHeader.propTypes = {};

export default ClientHeader;
