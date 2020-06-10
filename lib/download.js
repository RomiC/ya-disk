const request = require('./request');
require('./typedefs');

const { API_DOWNLOAD_LINK_URL } = require('./constants');

/**
 * @callback LinkSuccessCalback
 * @param {Link} link Download link
 */

/**
 * @param LinkErrorCallback
 * @param {Error} error Occured error
 */

/**
 * Get download link for the file
 * @see https://tech.yandex.ru/disk/api/reference/content-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @param {LinkSuccessCalback} [success] Success callback
 * @param {LinkErrorCallback} [error] Error callback
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
