/**
 * Upload file to the Yandex.Disk
 * @module ya-disk/upload
 */
const request = require('./request');

const { API_UPLOAD_LINK_URL } = require('./constants');

/**
 * @typedef {import('./download').Link} Link
 */

/**
 * Request for the upload link
 * @see https://tech.yandex.com/disk/api/reference/upload-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to file on server
 * @param {boolean} [overwrite=false] Overwrite existing file
 * @returns {Promise<Link, Error>} Promise to be resolved on getting link
 */
const link = async (token, path, overwrite = false) =>
  (
    await request.get({
      url: API_UPLOAD_LINK_URL,
      token,
      query: {
        path,
        overwrite
      }
    })
  ).data;

/**
 * Request to upload remote file to the disk by its url
 * @see https://tech.yandex.com/disk/api/reference/upload-ext-docpage/
 * @param {string} token OAuth token
 * @param {string} url Remote file url
 * @param {string} path Path to the file on server
 * @returns {Promise<Link, Error>} Promise to be resolved with link to upload operation status
 */
const remoteFile = async (token, url, path) =>
  (
    await request.post({
      url: API_UPLOAD_LINK_URL,
      token,
      query: {
        url,
        path
      }
    })
  ).data;

module.exports = {
  link,
  remoteFile
};
