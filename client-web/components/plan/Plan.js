import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "../commerce/Amount";
import { Button } from "reactstrap";

const Plan = ({ plan, onClick, className }) => {
  const { t } = useTranslation("common");
  return (
    <div
      className={`row list-item-box ${className}`}
    >
      <h1 className={"title"}>{plan.name}</h1>
      <div className="fs-6 fw-bold">{plan.description}</div>
      <div className="mt-3">
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div>
        <Amount
          amount={{
            figure: plan.subscription.price.gross,
            currencyCode: plan.subscription.currency,
          }}
          className="mr-4"
          style={{ fontSize: "2rem" }}
          t={t}
        />
        <sup className="ms-1 fs-6">/{t(`plan.${plan.subscription.interval}`)}</sup>
      </div>
      <div>{t("plan.Including taxes and fees")}</div>
      <div className="mt-3">
        <Button
          className={"btn-block-md-down"}
          size="lg"
          color="success"
          onClick={() => {
            onClick();
          }}
        >
          {t("plan.Select this plan")}
        </Button>
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
