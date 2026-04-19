/**
 * Working with trash resources
 * @module ya-disk/trash
 */
const request = require('./request');

const { API_TRASH_URL, API_RESTORE_URL } = require('./constants');

/**
 * @typedef {import('./request').ApiResponse} ApiResponse
 */

/**
 * Empty trash or delete a specific resource from trash
 * @see https://yandex.com/dev/disk-api/doc/en/reference/trash-delete
 * @param {string} token OAuth token
 * @param {string} [path] Relative path to the resource in trash
 * @returns {Promise<ApiResponse, Error>} Promise resolved with status and optional operation link
 */
const deleteResource = async (token, path) =>
  await request.delete({
    url: API_TRASH_URL,
    token,
    query: { path }
  });

/**
 * Restore a resource from trash
 * @see https://yandex.com/dev/disk-api/doc/en/reference/trash-restore
 * @param {string} token OAuth token
 * @param {string} path Relative path to the resource in trash
 * @param {string} [name] New name for restored resource
 * @param {boolean} [overwrite=false] Overwrite existing resource on restore
 * @returns {Promise<ApiResponse, Error>} Promise resolved with status and link
 */
const restore = async (token, path, name, overwrite = false) =>
  await request.put({
    url: API_RESTORE_URL,
    token,
    query: { path, name, overwrite }
  });

module.exports = {
  delete: deleteResource,
  restore
};
