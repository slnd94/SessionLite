const currencies = require("./currencies");

module.exports = {
  getAmountString: ({ amount, showCurrencyCode = false }) => {
    const { figure, currencyCode } = amount;
    if (typeof figure == 'number' && currencyCode) {
      return `${currencies[currencyCode].symbol}${figure.toFixed(
        currencies[currencyCode].decimals
      )} ${showCurrencyCode ? currencyCode : ""}`;
    } else {
      return "";
    }
  },
  getTaxDescriptionString: (taxObj) => {
    if (taxObj) {
      const { tax, rate } = taxObj;
      if (tax && rate) {
        return `${tax} @ ${rate * 100}%`;
      } else {
        return "";
      }
    }
  },
};
