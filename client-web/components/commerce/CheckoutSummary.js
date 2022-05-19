import React from "react";
import PropTypes from "prop-types";
import { getAmountString } from "../../helpers/commerceHelpers";

const CheckoutSummary = ({ amount, showNotSpecified, className, style, t }) => {
  return (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr data-testid="" className="small-line-height">
          <td>
            <span className="break-word">Items (3):</span>
          </td>
          <td className="text-end">$75.97</td>
        </tr>
        <tr data-testid="" className="order-summary-separator">
          <td></td>
          <td>
            <hr aria-hidden="true" className="a-spacing-none a-divider-normal" />
          </td>
        </tr>
        <tr data-testid="" className="small-line-height">
          <td>
            <span classNamess="break-word">Total before tax:</span>
          </td>
          <td className="text-end">$75.97</td>
        </tr>
        <tr data-testid="" className="small-line-height">
          <td>
            <span className="break-word">Estimated GST/HST:</span>
          </td>
          <td className="text-end">$9.88</td>
        </tr>
        <tr data-testid="" className="small-line-height">
          <td>
            <span className="break-word">Estimated PST/RST/QST:</span>
          </td>
          <td className="text-end">$0.00</td>
        </tr>

        <tr className="order-summary-grand-total">
          <td colspan="2" className="cell-separator">
            <hr aria-hidden="true" className="a-spacing-mini a-divider-normal" />
          </td>
        </tr>

        <tr data-testid="">
          <td>
            <span className="break-word">Order Total:</span>
          </td>
          <td className="text-end fw-bold" style={{fontSize: '1.25rem'}}>
            $85.85
          </td>
        </tr>
      </tbody>
    </table>
  );
};

CheckoutSummary.propTypes = {
  amount: PropTypes.object,
  showNotSpecified: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  t: PropTypes.func,
};

export default CheckoutSummary;
