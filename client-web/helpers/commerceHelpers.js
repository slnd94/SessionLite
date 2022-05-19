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
  if (amount) {
    const { figure, currencyCode } = amount;
    if (figure && currencyCode) {
      return `${currencySymbols[currencyCode].symbol}${figure.toFixed(
        currencySymbols[currencyCode].decimals
      )} ${showCurrencyCode ? currencyCode : ''}`;
    } else {
      return "";
    }
  }
};
