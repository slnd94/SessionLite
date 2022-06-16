import axios from "axios";
import { parseCookies } from "nookies";

export default async ({
  method,
  url,
  params,
  accessToken,
  headers = {},
  responseType,
  suppressAuthHeader = false,
}) => {
  const body = method === "get" ? "params" : "data";

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else {
    // if auth header not already provided, look in client cookies
    const cookies = parseCookies({});
    if (cookies?.accessToken && !suppressAuthHeader) {
      headers.Authorization = `Bearer ${cookies.accessToken}`;
    }
  }

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
};
