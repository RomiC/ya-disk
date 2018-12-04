const request = require('./request');

const { API_RESOURCES_URL } = require('./constants');

/**
 * Create Folder
 * @see https://tech.yandex.com/disk/api/reference/create-folder-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] Path
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const create = (token, path, success, error) =>
  request.put({
    url: API_RESOURCES_URL,
    token: token,
    query: {
      path: path
    }
  }, success, error);

/**
 * Remove File or Folder
 * @see https://tech.yandex.com/disk/api/reference/delete-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] File or Folder Path
 * @param {boolean} [permanently] permanently default false
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const remove = (token, path, permanently=false, success, error) =>
  request.delete({
    url: API_RESOURCES_URL,
    token: token,
    query: {
      path: path,
      permanently: permanently
    }
  }, success, error);

module.exports = {
  create,
  remove
};