import React from "react";
import PropTypes from "prop-types";

const ClientLogo = ({ handle, size, className, viewFileAuth }) => {
  const sizeStrings = {
    xs: "height:50",
    sm: "height:100,width:100",
    md: "height:200,width:200",
    lg: "height:300,width:300",
    xl: "height:600,width:600",
  };

  return (
    <img
      src={`https://cdn.filestackcontent.com/${process.env.NEXT_FILESTACK_API_KEY}/resize=${sizeStrings[size]},fit:clip/security=policy:${viewFileAuth.policy},signature:${viewFileAuth.signature}/${handle}`}
      className={className}
    />
  );
};

ClientLogo.propTypes = {
  size: PropTypes.string,
};

export default ClientLogo;
