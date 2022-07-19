const axios = require("axios");

module.exports = {
  api: async ({
    method,
    url,
    params,
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
