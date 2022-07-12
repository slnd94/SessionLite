import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { getFullName } from "../../helpers/nameHelpers";

const InviteListItem = ({ invite, className, onClick, customButtons }) => {
// console.log("🚀 ~ file: InviteListItem.js ~ line 8 ~ InviteListItem ~ invite", invite)
  const { t } = useTranslation("common");

  return (
    <div
      className={`row list-item ${className}`}
      style={{overflow: 'hidden'}}
      onClick={() => (onClick ? onClick() : null)}
    >
      <div className="col-12 col-md-6">
        <div>{invite?.email}</div>
      </div>
      <div className="col-12 col-md-6">
        <div></div>
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

InviteListItem.propTypes = {
  invite: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  customButtons: PropTypes.array,
};

export default InviteListItem;
