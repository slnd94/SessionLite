import React from "react";
import PropTypes from "prop-types";
import { getAmountString } from "../../helpers/commerceHelpers";

const Amount = ({ amount, showNotSpecified, className, style, t }) => {
  return (
    <div
      className={className}
      style={{ ...style, whiteSpace: "nowrap", display: "inline-block" }}
    >
      {amount.figure === -1
        ? showNotSpecified
          ? t("commerce.Not Specified")
          : ""
        : amount.figure === 0
        ? t("commerce.Free")
        : getAmountString(amount)}
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

export default Amount;
