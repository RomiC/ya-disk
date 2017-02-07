const https = require('https');
const {parse: urlParse} = require('url');
const {stringify: queryStringify} = require('querystring');

const defaultRequestParams = {
  method: 'GET',
  query: null,
  data: null
};

/**
 * Making request to API, parsing answers, handling errors
 * @param {object} options Request parameters
 * @param {string} options.url URL to request
 * @param {string} options.token OAuth token
 * @param {string} [options.method='GET'] Request type: POST, GET, etc.
 * @param {object} [options.query=null] Object with query params
 * @param {object} [options.data=null] Object with data params
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const request = (options, success, error) => {
  const params = Object.assign({}, defaultRequestParams, options);
  const parsedUrl = urlParse(options.url);
  
  const req = https.request(
    Object.assign(
      parsedUrl,
      {
        method: params.method,
        path: `${parsedUrl.path}${!!params.query ? `?${queryStringify(params.query)}` : ''}`,
        headers: {
          'Authorization': `OAuth ${options.token}`
        }
      }
    ),
    (res) => {
      let data = '';
      const {statusCode} = res;
      
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (statusCode === 200 && typeof success === 'function') {
          success(parsed);
        } else if (typeof error === 'function') {
          const e = new Error(parsed.description);
          e.name = parsed.error;
          error(e);
        }
      });
    }
  );
  
  req.on('error', (err) => {
    if (typeof error === 'function') {
      error(err);
    }
  });
  
  if (!!options.data) {
    req.write(JSON.stringify(options.data));
  }

  req.end();
};

module.exports = {
  get: (options, ...callbacks) => request(Object.assign(options, {method: 'GET'}), ...callbacks),
  post: (options, ...callbacks) => request(Object.assign(options, {method: 'POST'}), ...callbacks),
  put: (options, ...callbacks) => request(Object.assign(options, {method: 'PUT'}), ...callbacks)
};