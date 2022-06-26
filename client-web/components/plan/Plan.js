import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "../commerce/Amount";
import { Button, Badge } from "reactstrap";

const Plan = ({ plan, onClick, className }) => {
  const { t } = useTranslation("common");
  return (
    <div className={`row list-item-box mb-2 ${className}`}>
      {plan.tag && (
        <Badge
          color="primary"
          size="xl"
          className="p-1 pt-2 mt-n3 mb-2"
          // style={{ paddingTop: '100px', marginTop: "-20px", marginBottom: "10px" }}
        >
          <h5>{t(`plan.${plan.tag}`)}</h5>
        </Badge>
      )}
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
        <sup className="ms-1 fs-6">
          /{t(`plan.${plan.subscription.interval}`)}
        </sup>
      </div>
      <div>{t("plan.Including taxes and fees")}</div>
      <div className="mt-3">
        <Button
          className={"btn-block-md-down"}
          size="lg"
          color="secondary"
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
