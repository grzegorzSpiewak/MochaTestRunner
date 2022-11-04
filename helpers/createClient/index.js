/**
 * This switch request-promise to use Axios as the http request lib.
 * With the patching, no other things should need to be changed.
 * This switch should be seamless.  Please report any issues.
 * Thanks!
 */
const axios = require('axios');
const logger = require('terminal-log');
const { merge } = require('lodash');
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
 
/**
  * To map the options from old request-promise to Axios compatible options
  *
  * @param {*} oriOptions old request options
  * @returns {*} map to the Axios compatible options
  */
const mapOptions = (oriOptions = {}) => {
  return merge({}, {
    params: oriOptions.qs,
  }, oriOptions,
  );
};
 
/**
  * To map the response so that no need to change the assertions for previously written test cases.
  *
  * @param {*} resp The response from Axios response
  * @returns {*} The response which compitable with request-promise.
  */
const mapResponse = (resp) => {
  return resp && {
    body: resp.data,
    statusCode: resp.status,
    headers: resp.headers,
    request: resp.request,
  };
};
 
module.exports = (options) => {
  const baseURL = options.baseUrl || '';
  const headers = options.headers || {};
  const params = options.qs || {};
  const data = options.body || {};
 
  const axiosInstance = axios.create(
    merge({}, {
      responseType: 'json',
      baseURL,
      headers,
      params,
      validateStatus: null,
    }, options
    )
  );
 
  /**
    * retry the function for up to 10 times with 500ms each iteration
    *
    * @param {Function} fn the function to be retried
    * @param  {...any} argu The arguments of the function
    * @returns {*} return values of the function
    */
  const retryMethod = async (fn, ...argu) => {
    let cnt = 10;
    let error = true;
    let retVal;
 
    while (cnt > 0 && error) {
      try {
        retVal = await fn(...argu);
        error = false;
      } catch (e) {
        error = true;
        sleep(500);
      }
      cnt--;
    }
    if (options.debug) logger.info(JSON.stringify(retVal));
    return retVal;
  };
 
  return {
    getBaseUrl: () => baseURL,
    getHeaders: () => headers,
    getParams: () => params,
    get: async function (relUrl, options = {}) {
      const resp = await retryMethod(axiosInstance.get, relUrl, mapOptions(options));
      return mapResponse(resp);
    },
    post: async function (relUrl, options = {}) {
      const resp = await retryMethod(axiosInstance.post, relUrl, options.body || data, mapOptions(options));
      return mapResponse(resp);
    },
    delete: async function (relUrl, options = {}) {
      const resp = await retryMethod(axiosInstance.delete, relUrl, options.body || data, mapOptions(options));
      return mapResponse(resp);
    },
    put: async function (relUrl, options = {}) {
      const resp = await retryMethod(axiosInstance.put, relUrl, options.body || data, mapOptions(options));
      return mapResponse(resp);
    },
    del: async function (relUrl, options = {}) {
      return await this.delete(relUrl, options);
    },
    patch: async function (relUrl, options = {}) {
      const resp = await retryMethod(axiosInstance.patch, relUrl, options.body || data, mapOptions(options));
      return mapResponse(resp);
    },
  };
};
