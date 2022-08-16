import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "../commerce/Amount";
import { Button, Badge } from "reactstrap";

const Plan = ({
  plan,
  className,
  button,
  showTag,
  showPaymentDetails
}) => {
  const { t } = useTranslation("common");

  const getPlanPaymentDetailsString = () => {
    return t(
      `plan.You will be billed now, then once per ${plan.recurringInterval}`
    );
  };

  return (
    <div
      className={`row section-box mb-2 d-flex flex-direction-vertical justify-content-full align-content-full ${className} ${
        plan.eligibility && !plan.eligibility.eligible ? "disabled" : ""
      }`}
    >
      {plan.tag && showTag ? (
        <Badge
          color="secondary"
          size="xl"
          className="d-relative p-1 pt-2 mt-n5 mb-2"
          style={{ height: "40px" }}
        >
          <h5>{t(`plan.${plan.tag}`)}</h5>
        </Badge>
      ) : null}
      <h3>{plan.name}</h3>

      {/* {plan.eligibility ? <div>{JSON.stringify(plan.eligibility)}</div> : null} */}

      {plan.subscription ? (
        <div>
          <Amount
            amount={{
              figure: plan.subscription.price.gross,
              currencyCode: plan.subscription.currency,
            }}
            className={plan.eligibility && !plan.eligibility.eligible ? "" : "text-secondary"}
            style={{ fontSize: "2.25rem" }}
            t={t}
          />
          <sup className="ms-1 fs-6">
            ({plan.subscription.currency})/
            {t(`plan.${plan.subscription.interval}`)}
          </sup>
          {plan.subscription.price.gross > 0 ? (
            <div>{t("plan.Including taxes and fees")}</div>
          ) : null}
        </div>
      ) : null}

      <div className="fs-6 fw-bold">{plan.description}</div>
      <div className="mt-3">
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {showPaymentDetails ? (
        <div className="fw-bold mt-3">{getPlanPaymentDetailsString()}</div>
      ) : null}

      {plan.eligibility && !plan.eligibility.eligible ? (
        <div className="fw-bold text-dark mt-3">{t("plan.You are not currently eligible for this plan")}</div>
      ) : null}
      {button ? (
        <div className="d-flex align-items-end justify-content-between">
          <Button
            className={"btn-block"}
            size="lg"
            // color="secondary"
            color={button.disabled || (plan.eligibility && !plan.eligibility.eligible) ? "default" : "secondary"}
            onClick={() => {
              button.onClick();
            }}
            disabled={!!button.disabled}
          >
            {button.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

Plan.propTypes = {
  plans: PropTypes.array,
  button: PropTypes.object
};

Plan.defaultProps = {
  showTag: true,
  showPaymentDetails: false,
};

export default Plan;
