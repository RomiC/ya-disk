/**
 * Upload file to the Yandex.Disk
 * @module ya-disk/upload
 */
import { get, post } from './request.js';

import { API_UPLOAD_LINK_URL } from './constants.js';

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
export const link = async (token, path, overwrite = false) =>
  (
    await get({
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
export const remoteFile = async (token, url, path) =>
  (
    await post({
      url: API_UPLOAD_LINK_URL,
      token,
      query: {
        url,
        path
      }
    })
  ).data;

export default {
  link,
  remoteFile
};
