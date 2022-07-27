import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Plan from "./Plan";

const PlanList = ({ plans, currentPlan, onSelectPlan, onShowEligibilityDetail }) => {
  const { t } = useTranslation("common");

  const getPlanButton = (plan) => {
    // return isCurrentPlan(plan)
    // return plan.eligibility && !plan.eligibility.eligible
    //   ? null
      return {
          label: currentPlan
            ? isCurrentPlan(plan)
              ? t("plan.Current plan")
              : plan.eligibility && !plan.eligibility.eligible ? t("plan.Learn more") : t("plan.Move to this plan")
            : t("plan.Select this plan"),
          onClick: () => {
            plan.eligibility && !plan.eligibility.eligible
              ? onShowEligibilityDetail(plan)
              : onSelectPlan(plan);
          },
          disabled: isCurrentPlan(plan),
        };
  };

  const isCurrentPlan = (plan) => {
    return currentPlan?._id.toString() === plan._id.toString();
  };
  return (
    <div className="row">
      {plans?.map((plan) => (
        <div
          key={plan._id}
          className={`col-12 col-lg-${Math.floor(
            12 / plans.length
          )} d-flex justify-content-center`}
        >
          <Plan
            plan={plan}
            className={plan.tag ? "popular" : ""}
            button={getPlanButton(plan)}
          />
        </div>
      ))}
    </div>
  );
};

PlanList.propTypes = {
  plans: PropTypes.array,
  currentPlan: PropTypes.object,
  onSelectPlan: PropTypes.func,
  onShowEligibilityDetail: PropTypes.func
};

PlanList.defaultProps = {
  currentPlan: null,
};

export default PlanList;
