/**
 * Making request to Yandex.Disk API
 * @module ya-disk/request
 */
const https = require('https');
const { parse: urlParse } = require('url');
const { stringify: queryStringify } = require('querystring');

const defaultRequestParams = {
  method: 'GET',
  query: null,
  data: null
};

/**
 * @typedef ApiResponse
 * @type {object}
 * @prop {object} data Response payload
 * @prop {number} status Response status code
 */

/**
 * Making request to API, parsing answers, handling errors
 * @param {object} options Request parameters
 * @param {string} options.url URL to request
 * @param {string} options.token OAuth token
 * @param {string} [options.method='GET'] Request type: POST, GET, etc.
 * @param {object} [options.query=null] Object with query params
 * @param {object} [options.data=null] Object with data params
 * @returns {Promise<ApiResponse|Error>} Promise to be resolved on request complete
 */
const request = (options) =>
  new Promise((resolve, reject) => {
    const params = { ...defaultRequestParams, ...options };
    const parsedUrl = urlParse(options.url);

    const req = https.request(
      {
        ...parsedUrl,
        method: params.method,
        path: `${parsedUrl.path}${
          !!params.query ? `?${queryStringify(params.query)}` : ''
        }`,
        headers: {
          Authorization: `OAuth ${options.token}`
        }
      },
      (res) => {
        let data = '';
        const { statusCode } = res;

        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const parsedData = data === '' ? null : JSON.parse(data);

          if (statusCode >= 200 && statusCode < 300) {
            resolve({ data: parsedData, status: statusCode });
          } else {
            const e = new Error(parsedData.description);
            e.name = parsedData.error;
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);

    if (!!options.data) {
      req.write(JSON.stringify(options.data));
    }

    req.end();
  });

module.exports = {
  request,
  get(options) {
    return this.request({ ...options, method: 'GET' });
  },
  post(options) {
    return this.request({ ...options, method: 'POST' });
  },
  put(options) {
    return this.request({ ...options, method: 'PUT' });
  },
  patch(options) {
    return this.request({ ...options, method: 'PATCH' });
  },
  delete(options) {
    return this.request({ ...options, method: 'DELETE' });
  }
};
