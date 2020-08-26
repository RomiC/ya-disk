/**
 * Getting files list
 * @module ya-disk/list
 */
const request = require('./request');

const { API_FILES_URL } = require('./constants');

/**
 * @typedef {import('./meta').Resource} Resource
 */

/**
 * @typedef {object} FilesResourceList
 * @prop {Array<Resource>} items Array of the recently uploaded files
 * @prop {number} limit Files list limit
 * @prop {number} offset Files list offset
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#filesresourcelist
 */

/**
 * Getting flat list of files
 * @see https://tech.yandex.com/disk/api/reference/all-files-docpage/
 * @param {string} token OAuth token
 * @param {object} [options] Object with additional query parameters
 * @param {number} [options.limit] Limit number of files in list
 * @param {string} [options.media_type] Media type of requesting files
 * @param {number} [options.offset] Offset of the files list
 * @param {string} [options.preview_size] Preview size for the image resource
 * @param {boolean} [options.preview_crop] Crop preview image for the image resource if true
 * @returns {Promise<FilesResourceList, Error>} Promise to be resolved on getting files list
 */
const list = async (token, options) =>
  (
    await request.get({
      url: API_FILES_URL,
      token,
      query: options
    })
  ).data;

module.exports = list;
