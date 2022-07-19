import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "next-i18next";
import Amount from "./Amount";

const CheckoutSummary = ({ cart }) => {
  const { t } = useTranslation("common");
  return (
    <>
      {cart ? (
        <table style={{ width: "100%" }}>
          <tbody>
            <tr data-testid="">
              <td>
                <span>
                  {t("checkout.Items")} ({cart.items.length}):
                </span>
              </td>
              <td className="text-end">
                <Amount amount={cart.subtotal} showCurrencyCode={false} />
              </td>
            </tr>
            <tr data-testid="">
              <td></td>
              <td>
                <hr
                  aria-hidden="true"
                />
              </td>
            </tr>
            <tr data-testid="">
              <td>
                <span>
                  {t("checkout.Total before tax")}:
                </span>
              </td>
              <td className="text-end">
                <Amount amount={cart.subtotal} showCurrencyCode={false} />
              </td>
            </tr>
            {cart.taxes.map((tax, index) => (
              <tr key={index} data-testid="">
                <td>
                  <span>
                    {`${tax.tax} (${t("checkout.estimated")})`}:
                  </span>
                </td>
                <td className="text-end">
                  <Amount amount={tax.amount} showCurrencyCode={false} />
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan="2">
                <hr
                  aria-hidden="true"
                />
              </td>
            </tr>

            <tr data-testid="">
              <td>
                <span>{t("checkout.Order Total")}:</span>
              </td>
              <td className="text-end fw-bold" style={{ fontSize: "1.25rem" }}>
                <Amount amount={cart.total} showCurrencyCode={false} />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        null
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
