const request = require('./request');

const {API_UPLOAD_LINK_URL} = require('./constants');

/**
 * Request for thee upload link
 * @see https://tech.yandex.ru/disk/api/reference/upload-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to file on server
 * @param {boolean} [overwrite=false] Overwrite existsing file
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const link = (token, path, overwrite = false, success, error) => {
  request.get({
    url: API_UPLOAD_LINK_URL,
    token: token,
    query: {
      path: path,
      overwrite: overwrite
    }
  }, success, error);
};

module.exports = {
  link
};