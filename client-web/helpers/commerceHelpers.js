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

export const getAmountString = (amount) => {
  if (amount) {
    const { figure, currencyCode } = amount;
    if (figure && currencyCode) {
      return `${currencySymbols[currencyCode].symbol}${figure.toFixed(
        currencySymbols[currencyCode].decimals
      )} ${currencyCode}`;
    } else {
      return "";
    }
  }
};
