import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Plan from "./Plan";

const PlanList = ({ plans, currentPlan, onSelectPlan }) => {
  const { t } = useTranslation("common");

  const isCurrentPlan = (plan) => {
    return currentPlan?._id.toString() === plan._id.toString();
  }
  return (
    <div className="row">
      {plans?.map((plan) => (
        <div key={plan._id} className={`col-12 col-lg-${Math.floor(12/plans.length)} d-flex justify-content-center`}>
          <Plan
            plan={{
              ...plan,
              ...(isCurrentPlan(plan) ? { tag: "Your Current Plan" } : {})
            }}
            className={plan.tag ? 'popular' : ''}
            button={isCurrentPlan(plan) ? null : {
              label: currentPlan ? t("plan.Move to this plan") : t("plan.Select this plan"),
              onClick: () => {
                onSelectPlan(plan)
              },
              disabled: isCurrentPlan(plan)
            }}
            
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
};

PlanList.defaultProps = {
  currentPlan: null
};

export default PlanList;
