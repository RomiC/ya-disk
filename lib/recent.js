const request = require('./request');
require('./typedefs');

const { API_RECENT_FILES_URL } = require('./constants');

/**
 * @typedef LastUploadedResourceList
 * @type {object}
 * @property {Resource[]} items Array of recently uploaded files
 * @property {number} limit Requested amount of items
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#lastuploadedresourcelist
 */

/**
 * Get list of last uploaded files
 * @see https://tech.yandex.com/disk/api/reference/recent-upload-docpage/
 * @param {string} token OAuth token
 * @param {object} [options] Object with additional query parameters
 * @param {number} [options.limit] Limit number of files in list
 * @param {string} [options.media_type] Media type of requesting files
 * @param {string} [options.preview_size] Preview size for the image resource
 * @param {boolean} [options.preview_crop] Crop preview image for the image resource if true
 * @returns {Promise<LastUploadedResourceList, Error>} Promise resolved with a list of recently uploaded files
 */
const recent = async (token, options) =>
  (
    await request.get({
      url: API_RECENT_FILES_URL,
      token,
      query: options
    })
  ).data;

module.exports = recent;
