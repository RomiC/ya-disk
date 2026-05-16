/**
 * Download file module
 * @module ya-disk/download
 */
import { get } from './request.js';

import { API_DOWNLOAD_LINK_URL } from './constants.js';

/**
 * @typedef Link
 * @type {object}
 * @prop {string} href Download url (could be templated)
 * @prop {string} method Request method (GET, POST, etc.)
 * @prop {boolean} templated If true, URL should be templated before requesting (https://tools.ietf.org/html/rfc6570)
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#link
 */

/**
 * Get download link for the file
 * @see https://tech.yandex.com/disk/api/reference/content-docpage/#url-request
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @returns {Promise<Link, Error>} Promise to be resolve on getting link
 */
export const link = async (token, path) =>
  (
    await get({
      url: API_DOWNLOAD_LINK_URL,
      token,
      query: {
        path
      }
    })
  ).data;

export default { link };
