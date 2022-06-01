import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import { getAmountString } from "../../helpers/commerceHelpers";

const Amount = ({
  amount,
  showNotSpecified,
  showCurrencyCode,
  className,
  style,
}) => {
  const { t } = useTranslation("common");
  return (
    <div
      className={className}
      style={{ ...style, whiteSpace: "nowrap", display: "inline-block" }}
    >
      {amount.figure === -1
        ? showNotSpecified
          ? t("commerce.Not Specified")
          : ""
        : getAmountString({ amount, showCurrencyCode })}
    </div>
  );
};

Amount.propTypes = {
  amount: PropTypes.object,
  showNotSpecified: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  t: PropTypes.func,
};

Amount.defaultProps = {
  showCurrencyCode: false,
};

export default Amount;
