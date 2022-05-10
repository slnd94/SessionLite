
const currencies = require('./currencies');

module.exports = {
  getAmountString: (amount) => { 
    if(amount) {
      const { figure, currencyCode } = price;
      if(figure && currencyCode) {
        return `${currencies[currencyCode].symbol}${(figure).toFixed(currencies[currencyCode].decimals)} ${currencyCode}`;
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
