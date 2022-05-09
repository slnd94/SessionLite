
const currencySymbols = {
  CAD: '$',
  USD: '$'
};

export const getAmountString = (price) => {
  if(price) {
    const { cents, currencyCode } = price;
    if(cents && currencyCode) {
      return `${currencySymbols[currencyCode]}${(cents/100).toFixed(2)} ${currencyCode}`;
    } else {
      return '';
    }
  }
};
