import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";

function TenantUsage({ usage, className }) {
  const { t } = useTranslation("common");

  return (
    <div
      className={`row section-box mb-2 d-flex flex-direction-vertical justify-content-full align-content-full ${className}`}
    >
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th></th>
            <th className="text-end">{t("tenant.admin.users.Active")}</th>
            <th className="text-end">{t("tenant.admin.users.Invites")}</th>
            <th className="text-end">{t("tenant.admin.users.Total")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("tenant.admin.client.Clients")}</td>
            <td className="text-end">{usage.users.client.active}</td>
            <td className="text-end">{usage.users.client.invites}</td>
            <td className="text-end fw-bold">{usage.users.client.total}</td>
          </tr>
          <tr>
            <td>{t("tenant.admin.team.Team Members")}</td>
            <td className="text-end">{usage.users.team.active}</td>
            <td className="text-end">{usage.users.team.invites}</td>
            <td className="text-end fw-bold">{usage.users.team.total}</td>
          </tr>
          <tr>
            <td className="text-end fw-bold">
              {t("tenant.admin.users.Totals")}
            </td>
            <td className="text-end fw-bold">{usage.users.total.active}</td>
            <td className="text-end fw-bold">{usage.users.total.invites}</td>
            <td className="text-end fw-bold">{usage.users.total.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

TenantUsage.propTypes = {
  usage: PropTypes.object,
};

export default TenantUsage;
