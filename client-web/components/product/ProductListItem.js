import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const ProductListItem = ({ product, className, onClick, customButtons }) => {
  return (
    <div
      className={`list-item-box ${className}`}
      onClick={() => onClick ? onClick() : null}
    >
      <h5>{product.name}</h5>
      <p>{product.description}</p>
      {customButtons?.map((button, index) => (
        <Button
          key={index}
          className={button.className}
          color={button.color}        
          onClick={e => {
            e.stopPropagation();
            button.onClick()
          }}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.object,
  className: PropTypes.string,
  onClick:PropTypes.func,
  customButtons: PropTypes.array
};

export default ProductListItem;
