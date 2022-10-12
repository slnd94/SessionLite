import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import IconText from "../../IconText";
import {
  icons,
  FontAwesomeIcon,
} from "../../../utils/fontAwesome/fontAwesome";

const TemplateListItem = ({ template, className, selectedTemplate, onClick, customButtons }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`list-item ${className} ${selectedTemplate === template._id ? 'selected' : ''}`}
      onClick={() => (onClick ? onClick() : null)}
    >
      <div className="d-flex align-items-center" style={{gap: "1rem"}}>
        <div style={{flex: 19}}>
          <div className="">
            <h6 className="fw-bold">{template.name}</h6>
          </div>
          <div className="">
            <div>{template.description}</div>
          </div>
        </div>
        <div className="text-light" style={{ flex: 1 }}>          
        </div>
      </div>
    </div>
  );
};

TemplateListItem.propTypes = {
  template: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default TemplateListItem;
