/**
 * Copy/Move/Delete resources
 * @module ya-disk/resources
 */
import { post, put, delete as deleteRequest } from './request.js';

import {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL,
  API_PUBLISH_URL,
  API_UNPUBLISH_URL
} from './constants.js';

/**
 * @typedef {import('./request').ApiResponse} ApiResponse
 * @typedef {import('./download').Link} Link
 */

/**
 * Copy File or Folder
 * @see https://tech.yandex.com/disk/api/reference/copy-docpage/
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to copy from
 * @param {string} path File or Folder Path to copy to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @returns {Promise<ApiResponse, Error>} Promise to be resolved on copying resource completion
 */
export const copy = async (token, from, path, overwrite = false, fields = '') =>
  await post({
    url: API_COPY_URL,
    token,
    query: { from, path, overwrite, fields }
  });

/**
 * Create Folder
 * @see https://tech.yandex.com/disk/api/reference/create-folder-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] Path
 * @returns {Promise<Link, Error>} Promise to be resolved on new folder creation
 */
export const create = async (token, path) =>
  (
    await put({
      url: API_RESOURCES_URL,
      token,
      query: { path }
    })
  ).data;

/**
 * Move File or Folder
 * @see https://tech.yandex.com/disk/api/reference/move-docpage/
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to move from
 * @param {string} path File or Folder Path to move to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @returns {Promise<ApiResponse, Error>} Promise to be resolved on moving resource completion
 */
export const move = async (token, from, path, overwrite = false, fields = '') =>
  await post({
    url: API_MOVE_URL,
    token,
    query: { from, path, overwrite, fields }
  });

/**
 * Remove File or Folder
 * @see https://tech.yandex.com/disk/api/reference/delete-docpage/
 * @param {string} token OAuth token
 * @param {string} path File or Folder Path
 * @param {boolean} [permanently] permanently default false
 * @returns {Promise<ApiResponse, Error>} Promise to be resolved on file removing
 */
export const remove = async (token, path, permanently = false) =>
  await deleteRequest({
    url: API_RESOURCES_URL,
    token,
    query: {
      path,
      permanently
    }
  });

/**
 * Publish File or Folder
 * @see https://yandex.com/dev/disk-api/doc/en/reference/publish
 * @param {string} token OAuth token
 * @param {string} path File or Folder Path
 * @returns {Promise<Link, Error>} Promise to be resolved on publishing resource
 */
export const publish = async (token, path) =>
  (
    await put({
      url: API_PUBLISH_URL,
      token,
      query: { path }
    })
  ).data;

/**
 * Unpublish File or Folder
 * @see https://yandex.com/dev/disk-api/doc/en/reference/publish#unpublish-q
 * @param {string} token OAuth token
 * @param {string} path File or Folder Path
 * @returns {Promise<Link, Error>} Promise to be resolved on unpublishing resource
 */
export const unpublish = async (token, path) =>
  (
    await put({
      url: API_UNPUBLISH_URL,
      token,
      query: { path }
    })
  ).data;

export default {
  copy,
  create,
  move,
  remove,
  publish,
  unpublish
};
