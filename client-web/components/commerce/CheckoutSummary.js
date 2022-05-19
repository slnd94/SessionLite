import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from './Amount';

const CheckoutSummary = ({ cart }) => {
console.log("🚀 ~ file: CheckoutSummary.js ~ line 7 ~ CheckoutSummary ~ cart", cart)
  const { t } = useTranslation("common");
  return (
    <>
      {cart ? (
        <table style={{ width: "100%" }}>
          <tbody>
            <tr data-testid="" className="small-line-height">
              <td>
                <span className="break-word">
                  {t("checkout.Items")} ({cart.items.length}):
                </span>
              </td>
              <td className="text-end"><Amount amount={cart.subtotal} showCurrencyCode={false} /></td>
            </tr>
            <tr data-testid="" className="order-summary-separator">
              <td></td>
              <td>
                <hr
                  aria-hidden="true"
                  className="a-spacing-none a-divider-normal"
                />
              </td>
            </tr>
            <tr data-testid="" className="small-line-height">
              <td>
                <span classNamess="break-word">{t('checkout.Total before tax')}:</span>
              </td>
              <td className="text-end"><Amount amount={cart.subtotal} showCurrencyCode={false} /></td>
            </tr>
            {cart.taxes.map((tax, index) => (
              <tr key={index} data-testid="" className="small-line-height">
                <td>
                  <span className="break-word">{`${tax.tax} (${t('checkout.estimated')})`}:</span>
                </td>
                <td className="text-end"><Amount amount={tax.amount} showCurrencyCode={false} /></td>
              </tr>
            ))}

            <tr className="order-summary-grand-total">
              <td colspan="2" className="cell-separator">
                <hr
                  aria-hidden="true"
                  className="a-spacing-mini a-divider-normal"
                />
              </td>
            </tr>

            <tr data-testid="">
              <td>
                <span className="break-word">{t('checkout.Order Total')}:</span>
              </td>
              <td className="text-end fw-bold" style={{ fontSize: "1.25rem" }}>
                <Amount amount={cart.total} showCurrencyCode={true} />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </>
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
