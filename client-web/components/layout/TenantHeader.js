import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Button } from "reactstrap";
import IconText from "../IconText";
import { useTranslation } from "next-i18next";
import TenantLogo from "../tenant/TenantLogo";
import styles from "../../styles/Header.module.scss";

function TenantHeader({ tenant, admin, fileAuth }) {
  const { t } = useTranslation("common");
  return (
    <div className="row m-0 py-2 tenant-header sticky-top">
      <div className="d-flex col-11 justify-content-md-start align-content-center">
        <h5 className="m-0">
          <Link href={`/tenant/${tenant._id}`}>
            <span style={{ cursor: "pointer" }}>
              {tenant?.logo?.handle && fileAuth?.viewTenantLogo ? (
                <TenantLogo
                  handle={tenant.logo.handle}
                  size="xs"
                  className="me-3"
                  viewFileAuth={fileAuth?.viewTenantLogo}
                />
              ) : (
                <></>
              )}
              <span className="d-none d-md-inline-block pt-2">
                {tenant.name}
              </span>
            </span>
          </Link>
        </h5>
      </div>
      {admin ? (
        <div className="d-flex col-1 justify-content-end align-items-center">
          <h5 className="m-0">
            <Link href={`/tenant/${tenant._id}/admin/details`}>
              <Button color="default">
                <IconText icon="tenantAdmin" text={t("tenant.Admin")} />
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

TenantHeader.propTypes = {};

export default TenantHeader;
