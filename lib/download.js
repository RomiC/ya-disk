/**
 * Download file module
 * @module ya-disk/download
 */
const request = require('./request');

const { API_DOWNLOAD_LINK_URL } = require('./constants');

/**
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * @typedef {object} Link
 * @prop {string} href Download url (could be templated)
 * @prop {string} method Request method (GET, POST, etc.)
 * @prop {boolean} templated If true, URL should be templated before requesting (https://tools.ietf.org/html/rfc6570)
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#link
 */

/**
 * @callback LinkSuccessCalback
 * @param {Link} link Download link
 */

/**
 * Get download link for the file
 * @see https://tech.yandex.com/disk/api/reference/content-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @param {LinkSuccessCalback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const link = (token, path, success, error) =>
  request.get(
    {
      url: API_DOWNLOAD_LINK_URL,
      token: token,
      query: {
        path
      }
    },
    success,
    error
  );

module.exports = {
  link
};
