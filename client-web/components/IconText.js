import React from "react";
import PropTypes from "prop-types";
import { icons, FontAwesomeIcon } from "../utils/fontAwesome/fontAwesome";

const IconText = ({ className, style, icon, iconPosition, iconContainerClass, text, textContainerClass }) => {
  return (
    <div
      className={`icon-text ${className}`}
      style={{ ...style, whiteSpace: "nowrap", display: "inline-block" }}
    >
      {icon && iconPosition === "start" && (
        <div className={`icon-text-icon ${iconContainerClass}`}>
          <FontAwesomeIcon icon={icons[icon]} />
        </div>
      )}
      {text && (
        <div className={`icon-text-text ${textContainerClass}`}>
          {text}
        </div>
      )}
      {icon && iconPosition === "end" && (
        <div className={`icon-text-icon ${iconContainerClass}`}>
          <FontAwesomeIcon icon={icons[icon]} />
        </div>
      )}
    </div>
  );
};

IconText.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  iconContainerClass: PropTypes.string,
  text: PropTypes.string,
  textContainerClass: PropTypes.string,
  style: PropTypes.object,
  iconPosition: PropTypes.bool
};

IconText.defaultProps = {
  iconPosition: "start"
};

export default IconText;
