import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { getFullName } from "../../helpers/nameHelpers";
import IconText from "../IconText";

const UserCard = ({ user, className, onClick, customButtons }) => {
  const { t } = useTranslation("common");

  return (
    <>
      {user ? (
        <div
          className={`row section-box ${className}`}
          onClick={() => (onClick ? onClick() : null)}
        >
          <div className="col-12">
            <h4>{getFullName(user.name)}</h4>
            <div className="mt-2">
              <IconText icon="email" text={user.email} />
            </div>
            {user.tenantAdmin ? (
              <div className="mt-2">
                <IconText
                  icon="tenantAdmin"
                  text={t("tenant.admin.team.Administrator")}
                  className="fw-bold"
                />
              </div>
            ) : (
              null
            )}
            <div className="mt-2">
              {user.active ? (
                <IconText
                  icon="userActive"
                  text={t("user.Account is active")}
                  className="text-success"
                />
              ) : (
                <IconText
                  icon="userInactive"
                  text={t("user.Account is inactive")}
                />
              )}
            </div>
          </div>
          <div className="col-12 text-end">
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
      ) : (
        null
      )}
    </>
  );
};

UserCard.propTypes = {
  user: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  customButtons: PropTypes.array,
};

export default UserCard;
