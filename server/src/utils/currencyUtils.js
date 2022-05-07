
const currencies = require('./currencies');

module.exports = {
  getAmountString: (price) => { 
    if(price) {
      const { cents, currencyCode } = price;
      if(cents && currencyCode) {
        return `${currencies[currencyCode].symbol}${(cents/100).toFixed(2)} ${currencyCode}`;
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
