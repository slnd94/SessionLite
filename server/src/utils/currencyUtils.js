
const currencies = require('./currencies');

module.exports = {
  getAmountString: ({ amount, showCurrencyCode = true }) => { 
    if(amount) {
      const { figure, currencyCode } = price;
      if(figure && currencyCode) {
        return `${currencies[currencyCode].symbol}${(figure).toFixed(currencies[currencyCode].decimals)} ${showCurrencyCode ? currencyCode : ''}`;
      } else {
        return '';
      }
    }
  },
  getTaxDescriptionString: (taxObj) => { 
    if(taxObj) {
      const { tax, rate } = taxObj;
      if(tax && rate) {
        return `${tax} @ ${rate * 100}%`;
      } else {
        return '';
      }
    }
  }
};
