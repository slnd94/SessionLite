import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "../commerce/Amount";
import { Button, Badge } from "reactstrap";
import UserCounts from "../tenant/admin/UserCounts";
import { tenantPlanEligibility } from "../../utils/planUtils";

const PlanUsageCompare = ({ plan, usage, requestedUsage }) => {
  const { t } = useTranslation("common");

  return (
    <>
      <h5>
        {t("plan.Plan")}: {plan?.name}
      </h5>
      <p>
        {t(
          "tenant.admin.plan.To subscribe to this plan, you cannot exceed any of the user limits shown here"
        )}
        :
      </p>
      <UserCounts usage={plan?.allowances} />
      {requestedUsage ? (
        <>
          <p className="mt-5">
            {t(
              "tenant.admin.plan.If this action were completed, your user counts would look like this (highlighted counts would exceed the plan's limits)"
            )}
            :
          </p>
          <UserCounts
            usage={requestedUsage}
            planEligibility={tenantPlanEligibility({
              plan: plan,
              usage: requestedUsage,
            })}
          />
        </>
      ) : (
        <>
          <p className="mt-5">
            {t(
              "tenant.admin.plan.Your current user counts (highlighted counts exceed the plan's limits)"
            )}
            :
          </p>
          <UserCounts usage={usage} planEligibility={plan?.eligibility} />
        </>
      )}
      <h5 className="mt-5">{t("tenant.admin.plan.What are your options?")}</h5>
      <ul>
        <li>{t("tenant.admin.plan.Consider a different plan")}</li>
        <li>
          {t(
            "tenant.admin.plan.Deactivate some existing active users (clients or team members)"
          )}
        </li>
        <li>
          {t(
            "tenant.admin.plan.Revoke some existing invitations (clients or team members)"
          )}
        </li>
      </ul>
    </>
  );
};

PlanUsageCompare.propTypes = {
  plan: PropTypes.object,
  usage: PropTypes.object,
};

export default PlanUsageCompare;
