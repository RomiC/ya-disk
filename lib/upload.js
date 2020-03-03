const request = require('./request');

const { API_UPLOAD_LINK_URL } = require('./constants');

/**
 * Request for thee upload link
 * @see https://tech.yandex.ru/disk/api/reference/upload-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to file on server
 * @param {boolean} [overwrite=false] Overwrite existsing file
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const link = (token, path, overwrite = false, success, error) =>
  request.get(
    {
      url: API_UPLOAD_LINK_URL,
      token: token,
      query: {
        path: path,
        overwrite: overwrite
      }
    },
    success,
    error
  );

/**
 * Request to upload remote file to the disk by its url
 * @see https://tech.yandex.ru/disk/api/reference/upload-ext-docpage/
 * @param {string} token OAuth token
 * @param {string} url Remote file url
 * @param {string} path Path to the file on server
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const remoteFile = (token, url, path, success, error) =>
  request.post(
    {
      url: API_UPLOAD_LINK_URL,
      token: token,
      query: {
        url: url,
        path: path
      }
    },
    success,
    error
  );

module.exports = {
  link,
  remoteFile
};
