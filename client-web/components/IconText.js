import React from "react";
import PropTypes from "prop-types";
import { icons, FontAwesomeIcon } from "../utils/fontAwesome/fontAwesome";

const IconText = ({ className, style, icon, iconPosition, iconContainerClass, text, textContainerClass, onClick }) => {
  return (
    <div
      className={`icon-text ${className}`}
      style={{ ...style, whiteSpace: "nowrap", display: "inline-block", cursor: onClick ? "pointer" : "normal" }}
      onClick={() => {
        if(onClick) {
          onClick();
        }
      }}
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
  iconPosition: PropTypes.string,
  onClick: PropTypes.func
};

IconText.defaultProps = {
  iconPosition: "start"
};

export default IconText;
