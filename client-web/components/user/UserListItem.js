import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { getFullName } from "../../helpers/nameHelpers";
import IconText from "../IconText";

const UserListItem = ({ user, className, onClick, customButtons }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`row list-item ${user.active ? "" : "inactive"} ${className}`}
      onClick={() => (onClick ? onClick() : null)}
    >
      <div className="col-12 col-md-4">
        <div>
          {user.name.family}, {user.name.given}
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div>
          {t(`tenant.admin.users.${user.active ? "Active" : "Inactive"}`)}
        </div>
      </div>
      <div className="col-12 col-md-4">
      <div>
          {user.tenantAdmin ? (
            <IconText
              icon="tenantAdmin"
              text={t(`tenant.admin.team.Administrator`)}
            />
          ) : (
            null
          )}
        </div>
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

UserListItem.propTypes = {
  user: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  customButtons: PropTypes.array,
};

export default UserListItem;
