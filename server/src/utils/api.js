const axios = require("axios");
// import { parseCookies } from "nookies";

module.exports = {
  api: async ({
    method,
    url,
    params,
    accessToken,
    headers = {},
    responseType
  }) => {
    const body = method === "get" ? "params" : "data";

    try {
      const response = await axios.request({
        method,
        url,
        responseType: responseType || null,
        [body]: params || {},
        headers,
      });
      return response;
    } catch (err) {
      return err;
    }
  },
};
