const currencySymbols = {
  CAD: {
    symbol: "CA$",
    decimals: 2,
  },
  USD: {
    symbol: "$",
    decimals: 2,
  },
  AUD: {
    symbol: "A$",
    decimals: 2,
  },
  EUR: {
    symbol: "€",
    decimals: 2,
  },
  NZD: {
    symbol: "NZ$",
    decimals: 2,
  },
  GBP: {
    symbol: "£",
    decimals: 2,
  },
};

export const getAmountString = ({ amount, showCurrencyCode = false }) => {
  const { figure, currencyCode } = amount;
  if (typeof figure == "number" && currencyCode) {
    return `${currencySymbols[currencyCode].symbol}${figure.toFixed(
      currencySymbols[currencyCode].decimals
    )} ${showCurrencyCode ? currencyCode : ""}`;
  } else {
    return "";
  }
};
