/**
 * Download file module
 * @module ya-disk/download
 */
const request = require('./request');
require('./typedefs');

const { API_DOWNLOAD_LINK_URL } = require('./constants');

/**
 * Get download link for the file
 * @see https://tech.yandex.com/disk/api/reference/content-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @returns {Promise<Link, Error>} Promise to be resolve on getting link
 */
const link = async (token, path) =>
  (
    await request.get({
      url: API_DOWNLOAD_LINK_URL,
      token,
      query: {
        path
      }
    })
  ).data;

module.exports = {
  link
};
