import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import Amount from "../commerce/Amount";

const ProductListItem = ({ product, className, onClick, customButtons }) => {
  const { t } = useTranslation("common");

  const [userCurrencyCode, setUserCurrencyCode] = useState(
    process.env.DEFAULT_CURRENCY
  );

  return (
    <div
      className={`row list-item-box ${className}`}
      onClick={() => (onClick ? onClick() : null)}
    >
      <div className="col-12 col-md-6">
        <h5>{product.name}</h5>
        <div>
          {product.description}
        </div>
        <div>
          <Amount
            amount={{
              figure: product.prices[userCurrencyCode],
              currencyCode: userCurrencyCode,
            }}
            className="mr-4"
            style={{ fontSize: "1.5rem" }}
            t={t}
          />
        </div>
      </div>
      <div className="col-12 col-md-6 text-end">
        {customButtons?.map((button, index) => (
          <Button
            key={index}
            className={button.className}
            color={button.color}
            onClick={(e) => {
              e.stopPropagation();
              button.onClick();
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  customButtons: PropTypes.array,
};

export default ProductListItem;
