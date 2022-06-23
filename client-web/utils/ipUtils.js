export const getUserIP = (req) => {
  console.log("🚀 ~ file: ipUtils.js ~ line 2 ~ getUserIP ~ req.connection", req.connection)
console.log("🚀 ~ file: ipUtils.js ~ line 2 ~ getUserIP ~ req.headers", req.headers)
  let ip;
  if (req.headers["x-forwarded-for"]) {
    ip = req.headers["x-forwarded-for"].split(",")[0];
  } else if (req.headers["x-real-ip"]) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.connection.remoteAddress;
  }
  if (isValidIP(ip)) {
    return ip;
  } else {
    return null;
  }
};

const isValidIP = (str) => {
  // Regular expression to check if string is a IP address
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(str);
};
