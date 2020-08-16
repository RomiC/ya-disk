/**
 * Working with recently updated files
 * @module ya-disk/recent
 */
const request = require('./request');

const { API_RECENT_FILES_URL } = require('./constants');

/**
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 * @typedef {import('./meta').Resource} Resource
 */

/**
 * @typedef {object} LastUploadedResourceList
 * @property {Resource[]} items Array of recently uploaded files
 * @property {number} limit Requested amount of items
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#lastuploadedresourcelist
 */

/**
 * @callback RecentSuccessCallback
 * @param {LastUploadedResourceList} data Recently uploaded file list
 * @param {number} status Response status code
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
 * @param {RecentSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const recent = (token, options, success, error) =>
  request.get(
    {
      url: API_RECENT_FILES_URL,
      token: token,
      query: options
    },
    success,
    error
  );

module.exports = recent;
