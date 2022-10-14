import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    // if auth header not already provided, look in async storage
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken && !suppressAuthHeader) {
      headers.Authorization = `Bearer ${accessToken}`;
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
