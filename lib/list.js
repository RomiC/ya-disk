const request = require('./request');

const { API_FILES_URL } = require('./constants');

/**
 * Getting flat list of files
 * @see https://tech.yandex.ru/disk/api/reference/all-files-docpage/
 * @param {string} token OAuth token
 * @param {object} [options] Object with additional query parameters
 * @param {number} [options.limit] Limit number of files in list
 * @param {string} [options.media_type] Media type of requesting files
 * @param {number} [options.offset] Offset of the files list
 * @param {string} [options.preview_size] Preview size for the image resource
 * @param {boolean} [options.preview_crop] Crop preview image for the image resource if true
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const list = (token, options, success, error) =>
  request.get(
    {
      url: API_FILES_URL,
      token: token,
      query: options
    },
    success,
    error
  );

module.exports = list;
