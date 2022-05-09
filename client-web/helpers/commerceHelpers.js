
const currencySymbols = {
  CAD: '$',
  USD: '$'
};

export const getAmountString = (price) => {
console.log("🚀 ~ file: commerceHelpers.js ~ line 8 ~ getAmountString ~ price", price)
  if(price) {
    const { cents, currencyCode } = price;
    if(cents && currencyCode) {
      return `${currencySymbols[currencyCode]}${(cents/100).toFixed(2)} ${currencyCode}`;
    } else {
      return '';
    }
  }
};
