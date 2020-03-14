const request = require('./request');

const { API_DOWNLOAD_LINK_URL } = require('./constants');

/**
 * Get download link for the file
 * @see https://tech.yandex.ru/disk/api/reference/content-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
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
