const currencySymbols = {
  CAD: {
    symbol: "$",
    decimals: 2,
  },
  USD: {
    symbol: "$",
    decimals: 2,
  },
};

export const getAmountString = ({ amount, showCurrencyCode = true }) => {
  const { figure, currencyCode } = amount;
  if (typeof figure == "number" && currencyCode) {
    return `${currencySymbols[currencyCode].symbol}${figure.toFixed(
      currencySymbols[currencyCode].decimals
    )} ${showCurrencyCode ? currencyCode : ""}`;
  } else {
    return "";
  }
};
