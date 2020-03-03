const request = require('./request');

const { API_RESOURCES_URL } = require('./constants');

/**
 * Request meta-info for the resource (file or folder)
 * @see https://tech.yandex.ru/disk/api/reference/meta-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} [options={}] Additional options
 * @param {string} [options.sort] Sorting attribute name: (name, path, created, modified, size)
 * @param {number} [options.limit] Number of resources in response
 * @param {number} [options.offset] Offset of the resources list
 * @param {string} [options.preview_size] Size of the preview for the image resource
 * @param {boolean} [options.preview_crop] Crop preview of the image resource if true
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const get = (token, path, options = {}, success, error) =>
  request.get(
    {
      url: API_RESOURCES_URL,
      token: token,
      query: Object.assign({ path }, options)
    },
    success,
    error
  );

/**
 * Append meta-info to the resource (file or folder)
 * @see https://tech.yandex.ru/disk/api/reference/meta-add-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} props Object with additional properties
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const add = (token, path, props, success, error) =>
  request.patch(
    {
      url: API_RESOURCES_URL,
      token: token,
      query: {
        path
      },
      data: {
        custom_properties: props
      }
    },
    success,
    error
  );

module.exports = {
  get,
  add
};
