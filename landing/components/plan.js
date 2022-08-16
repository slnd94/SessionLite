import React from "react";
import PropTypes from "prop-types";
import Amount from "./amount";
import Link from "next/link";
// import { Button, Badge } from "reactstrap";

const Plan = ({ plan }) => {
  const getPlanPaymentDetailsString = () => {
    return `plan.You will be billed now, then once per ${plan.recurringInterval}`;
  };

  return (
    <div className="lg:col-span-2 xl:col-auto">
      <div className={`flex flex-col justify-between w-full h-full bg-gray-100 px-6 rounded-2xl py-10 dark:bg-trueGray-800 ${plan.tag ? "border-solid border-4  border-indigo-600" : ""}`}>
      {plan.tag 
      
      ? <div className="-mt-16 mb-6 px-6 py-2 text-white bg-indigo-600 rounded-md text-center">{plan.tag}</div>
      : null }
        <h2 className="text-3xl font-medium text-gray-800 dark:text-gray-200 mt-0 mb-4">
          {plan.name}
        </h2>

        {plan.subscription ? (
          <div>
            <Amount
              amount={{
                figure: plan.subscription.price.gross,
                currencyCode: plan.subscription.currency,
              }}
              className="mr-4 text-indigo-600"
              style={{ fontSize: "2.25rem" }}
            />
            <sup className="ms-1 fs-6">
              ({plan.subscription.currency})/
              {plan.subscription.interval}
            </sup>
            {plan.subscription.price.gross > 0 ? (
              <div>Including taxes and fees</div>
            ) : <div>Free forever</div>}
          </div>
        ) : null}

        <div className="mt-6 fs-6 font-bold">{plan.description}</div>
        <div className="mt-6">
          <ul style={{ listStyleType: "disc" }}>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <Link
            href={`${process.env.NEXT_PUBLIC_WEB_URL}/tenant/register?plan=${plan._id}`}
          >
            <a className="px-6 py-4 text-white bg-indigo-600 rounded-md block text-center text-xl">
            {plan.subscription.price.gross > 0 ? "Start Free Trial" : "Start Now"}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

Plan.propTypes = {
  plans: PropTypes.array,
  button: PropTypes.object,
};

Plan.defaultProps = {
  showTag: true,
  showPaymentDetails: false,
};

export default Plan;
