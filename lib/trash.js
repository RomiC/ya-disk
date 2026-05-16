/**
 * Working with trash resources
 * @module ya-disk/trash
 */
import { put, delete as deleteRequest } from './request.js';

import { API_TRASH_URL, API_RESTORE_URL } from './constants.js';

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
export const deleteResource = async (token, path) =>
  await deleteRequest({
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
export const restore = async (token, path, name, overwrite = false) =>
  await put({
    url: API_RESTORE_URL,
    token,
    query: { path, name, overwrite }
  });

export { deleteResource as delete };
export default {
  delete: deleteResource,
  restore
};
