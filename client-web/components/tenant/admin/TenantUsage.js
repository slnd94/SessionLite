import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";

function TenantUsage({ usage, planEligibility, className }) {
  console.log("🚀 ~ file: TenantUsage.js ~ line 6 ~ TenantUsage ~ planEligibility", planEligibility?.usageOver)
  const { t } = useTranslation("common");

  const usageString = figure => figure >= 0 ? figure : "";

  return (
    <div
      className={`row section-box mb-2 d-flex flex-direction-vertical justify-content-full align-content-full ${className}`}
    >
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th></th>
            <th className={`text-center`}>{t("tenant.admin.users.Active")}</th>
            <th className={`text-center`}>{t("tenant.admin.users.Invites")}</th>
            <th className={`text-center`}>{t("tenant.admin.users.Total")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("tenant.admin.client.Clients")}</td>
            <td className={`text-center ${planEligibility?.usageOver?.indexOf("users.client.active") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.client.active)}</td>
            <td className={`text-center ${planEligibility?.usageOver?.indexOf("users.client.invites") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.client.invites)}</td>
            <td className={`text-center fw-bold ${planEligibility?.usageOver?.indexOf("users.client.total") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.client.total)}</td>
          </tr>
          <tr>
            <td>{t("tenant.admin.team.Team Members")}</td>
            <td className={`text-center ${planEligibility?.usageOver?.indexOf("users.team.active") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.team.active)}</td>
            <td className={`text-center ${planEligibility?.usageOver?.indexOf("users.team.invites") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.team.invites)}</td>
            <td className={`text-center fw-bold ${planEligibility?.usageOver?.indexOf("users.team.total") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.team.total)}</td>
          </tr>
          <tr>
            <td>{t("tenant.admin.users.Total")}</td>
            <td className={`text-center fw-bold ${planEligibility?.usageOver?.indexOf("users.total.active") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.total.active)}</td>
            <td className={`text-center fw-bold ${planEligibility?.usageOver?.indexOf("users.total.invites") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.total.invites)}</td>
            <td className={`text-center fw-bold ${planEligibility?.usageOver?.indexOf("users.total.total") >= 0 ? "text-white bg-danger" : ""}`}>{usageString(usage.users.total.total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

TenantUsage.propTypes = {
  usage: PropTypes.object,
  planEligibility: PropTypes.object
};

export default TenantUsage;
