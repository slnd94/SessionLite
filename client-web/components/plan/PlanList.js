import React from "react";
import PropTypes from "prop-types";
import Plan from "./Plan";
import { PlaceholderButton } from "reactstrap";

const PlanList = ({ plans, onSelectPlan }) => {
  return (
    <div className="row">
      {plans.map((plan) => (
        <div key={plan._id} className={`col-12 col-md-${Math.floor(12/plans.length)} d-flex justify-content-center`}>
          <Plan
            plan={plan}
            onClick={() => {
              onSelectPlan(plan)
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
