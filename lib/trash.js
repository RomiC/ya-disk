/**
 * Working with trash resources
 * @module ya-disk/trash
 */
const request = require('./request');

const { API_TRASH_URL, API_RESTORE_URL } = require('./constants');

/**
 * @typedef {import('./request').RequestSuccessCallback} RequestSuccessCallback
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * Empty trash or delete a specific resource from trash
 * @see https://yandex.com/dev/disk-api/doc/en/reference/trash-delete
 * @param {string} token OAuth token
 * @param {string} [path] Relative path to the resource in trash
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const deleteResource = (token, path, success, error) =>
  request.delete(
    {
      url: API_TRASH_URL,
      token: token,
      query: { path: path }
    },
    success,
    error
  );

/**
 * Restore a resource from trash
 * @see https://yandex.com/dev/disk-api/doc/en/reference/trash-restore
 * @param {string} token OAuth token
 * @param {string} path Relative path to the resource in trash
 * @param {string} [name] New name for restored resource
 * @param {boolean} [overwrite=false] Overwrite existing resource on restore
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const restore = (token, path, name, overwrite = false, success, error) =>
  request.put(
    {
      url: API_RESTORE_URL,
      token: token,
      query: { path: path, name: name, overwrite: overwrite }
    },
    success,
    error
  );

module.exports = {
  delete: deleteResource,
  restore
};
