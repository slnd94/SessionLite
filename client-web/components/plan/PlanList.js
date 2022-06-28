import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";

const PlanList = ({ plans, onSelectPlan }) => {
  const { t } = useTranslation("common");
  return (
    <div className="row">
      {plans?.map((plan) => (
        <div key={plan._id} className={`col-12 col-md-${Math.floor(12/plans.length)} d-flex justify-content-center`}>
          <Plan
            plan={plan}
            className={plan.tag ? 'popular' : ''}
            button={{
              label: t("plan.Select this plan"),
              onClick: () => {
                onSelectPlan(plan)
              }
            }}
            
          />
        </div>
      ))}
    </div>
  );
};

PlanList.propTypes = {
  plans: PropTypes.array,
  onSelectPlan: PropTypes.func,
};

PlanList.defaultProps = {};

export default PlanList;
