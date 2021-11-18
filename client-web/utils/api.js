import axios from 'axios';

export default async ({ method, url, params, headers = {}, responseType, suppressAuthHeader = false }) => {
  const body = method === 'get' ? 'params' : 'data';

  const authHeaders = localStorage.authToken && !suppressAuthHeader ? {
    Authorization: `Bearer ${localStorage.authToken}`
  } : {};

  const combinedHeaders = {
    ...authHeaders,
    ...headers
  };
  
  try {
    const response = await axios.request({
      method,
      url,
      responseType: responseType || null,
      [body]: params || {},
      headers: combinedHeaders
    });
    return response;
  } catch(err) {
    return err;
  }

  // return response;
  //   .then(function (response) {
  //     return response;
  //   })
  //   .catch(function (error) {
  //     return error;
  //   });
};