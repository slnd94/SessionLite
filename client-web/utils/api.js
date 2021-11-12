import axios from 'axios';

export default ({ method, url, params, headers = {}, responseType, suppressAuthHeader = false }) => {
  const body = method === 'get' ? 'params' : 'data';

  const authHeaders = localStorage.authToken && !suppressAuthHeader ? {
    Authorization: `Bearer ${localStorage.authToken}`
  } : {};

  const combinedHeaders = {
    ...authHeaders,
    ...headers
  };
  
  return axios.request({
    method,
    url,
    responseType: responseType || null,
    [body]: params || {},
    headers: combinedHeaders
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};