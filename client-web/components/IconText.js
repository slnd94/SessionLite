import React from "react";
import PropTypes from "prop-types";
import { icons, FontAwesomeIcon } from "../utils/fontAwesome/fontAwesome";

const IconText = (props) => {
  return (
    <div
      className={`icon-text ${props.className}`}
      style={{ ...props.style, whiteSpace: "nowrap", display: "inline-block" }}
    >
      {props.icon && !props.iconEnd && (
        <div className={`icon-text-icon ${props.iconContainerClass}`}>
          <FontAwesomeIcon icon={icons[props.icon]} />
        </div>
      )}
      {props.text && (
        <div className={`icon-text-text ${props.textContainerClass}`}>
          {props.text}
        </div>
      )}
      {props.icon && props.iconEnd && (
        <div className={`icon-text-icon ${props.iconContainerClass}`}>
          <FontAwesomeIcon icon={icons[props.icon]} />
        </div>
      )}
    </div>
  );
};

IconText.propTypes = {
  icon: PropTypes.string,
  iconContainerClass: PropTypes.string,
  text: PropTypes.string,
  textContainerClass: PropTypes.string,
  style: PropTypes.object,
  iconEnd: PropTypes.bool
};

IconText.defaultProps = {
  iconEnd: false
};

export default IconText;
