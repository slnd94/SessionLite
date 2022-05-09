import React from 'react';
import PropTypes from 'prop-types';
import { getAmountString } from '../../helpers/commerceHelpers';

const Amount = ({ amount, showNotSpecified, className, style, t }) => {
console.log("🚀 ~ file: Amount.js ~ line 6 ~ Amount ~ amount", amount)
  return (
    <div
      className={className}
      style={{...style, whiteSpace: 'nowrap', display: 'inline-block'}}
    >
      {amount.cents === -1 ? (showNotSpecified ? t('commerce.Not Specified') : '')
        : amount.cents === 0 ? t('commerce.Free') : getAmountString(amount)}
    </div>
  );
};

Amount.propTypes = { 
};

export default Amount;
