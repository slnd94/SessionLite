import React from "react";
import PropTypes from "prop-types";

const Plan = ({ plan, onClick, className }) => {
  return (
    <div
      className={`row list-item-box ${className}`}
      onClick={() => (onClick ? onClick() : null)}
    >
      <h3 className={"title"}>{plan.name}</h3>
      <div>
        {plan.description}
      </div>
      <div className="mt-3">
        <ul>
          {plan.features.map((feature, index) => <li key={index}>{feature}</li>)}
        </ul>
      </div>
    </div>
  );
};

Plan.propTypes = {
  plans: PropTypes.array,
  onSelectPlan: PropTypes.func,
};

Plan.defaultProps = {};

export default Plan;
