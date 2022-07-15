import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "../commerce/Amount";
import { Button, Badge } from "reactstrap";
import IconText from "../IconText";

const Plan = ({
  plan,
  onClick,
  className,
  button,
  showTag,
  showPaymentDetails,
}) => {
  const { t } = useTranslation("common");

  const getPlanPaymentDetailsString = () => {
    return t(
      `plan.You will be billed now, then once per ${plan.recurringInterval}`
    );
  };

  return (
    <div
      className={`row list-item-box mb-2 d-flex flex-direction-vertical justify-content-full align-content-full ${className}`}
    >
      {plan.tag && showTag ? (
        <Badge
          color="secondary"
          size="xl"
          className="p-1 pt-2 mt-n3 mb-2"
          style={{height: "40px"}}
          // style={{ paddingTop: '100px', marginTop: "-20px", marginBottom: "10px" }}
        >
          <h5>{t(`plan.${plan.tag}`)}</h5>
        </Badge>
      ) : (
        <></>
      )}
      <h4 className={"title"}>{plan.name}</h4>

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
          style={{ fontSize: "2.25rem" }}
          t={t}
        />
        <sup className="ms-1 fs-6">
          ({plan.subscription.currency})/
          {t(`plan.${plan.subscription.interval}`)}
        </sup>
        {plan.subscription.price.gross > 0 ? (
          <div>{t("plan.Including taxes and fees")}</div>
        ) : (
          <></>
        )}
      </div>
      {showPaymentDetails ? (
        <div className="fw-bold mt-3">{getPlanPaymentDetailsString()}</div>
      ) : (
        <></>
      )}
      {button ? (
        <div className="mt-3 d-flex align-items-end justify-content-full">
          <Button
            className={"btn-block"}
            size="lg"
            // color="secondary"
            color={plan.tag ? "secondary" : "primary"}
            onClick={() => {
              button.onClick();
            }}
            disabled={!!button.disabled}
          >
            {button.label}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

Plan.propTypes = {
  plans: PropTypes.array,
  onSelectPlan: PropTypes.func,
};

Plan.defaultProps = {
  showTag: true,
  showPaymentDetails: false,
};

export default Plan;
