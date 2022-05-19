import React from "react";
import PropTypes from "prop-types";
import { Button } from "reactstrap";

const ProductListItem = ({ product, className, onClick, customButtons }) => {
  return (
    <div
      className={`row list-item-box ${className}`}
      onClick={() => (onClick ? onClick() : null)}
    >
      <div className="col-12 col-md-6">
        <h5>{product.name}</h5>
        <p>{product.description}</p>
      </div>
      <div className="col-12 col-md-6 text-end">
        {customButtons?.map((button, index) => (
          <Button
            key={index}
            className={button.className}
            color={button.color}
            onClick={(e) => {
              e.stopPropagation();
              button.onClick();
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

ProductListItem.propTypes = {
  product: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  customButtons: PropTypes.array,
};

export default ProductListItem;
