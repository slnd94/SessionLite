import React from "react";
import PropTypes from "prop-types";

const ClientLogo = ({ handle, size, className }) => {
  const sizeStrings = {
    xs: "height:50,width:50",
    sm: "height:100,width:100",
    md: "height:200,width:200",
    lg: "height:300,width:300",
    xl: "height:600,width:600",
  };

  return (
    <img
      src={`https://cdn.filestackcontent.com/${process.env.NEXT_FILESTACK_API_KEY}/resize=${sizeStrings[size]},fit:clip/security=policy:eyJleHBpcnkiOjE2NTU0Mzg0MDAsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXX0=,signature:9b6df60755caf96f57761dba98bf427f103ddcffd769be6c803231d69b885632/${handle}`}
      className={className}
    />
  );
};

ClientLogo.propTypes = {
  size: PropTypes.string,
};

export default ClientLogo;
