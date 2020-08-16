/**
 * Working with resource meta-info
 * @module ya-disk/meta
 */
const request = require('./request');

const { API_RESOURCES_URL } = require('./constants');

/**
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * @typedef {object} Resource
 * @prop {string} [public_key] Public key of the Resource (only for shared Resources)
 * @prop {string} [public_url] Public link to the Resource (only for shared Resources)
 * @prop {ResourceList} [_embedded] Resources of the folder
 * @prop {string} preview Preview image of the resource (for supported graphic files)
 * @prop {string} name Resource name
 * @prop {object} custom_properties Hash-map of properties added via meta-method
 * @prop {string} created Creation date in ISO 8601.
 * @prop {string} modified Modification date in ISO 8601.
 * @prop {string} path Absolute path to the Resource
 * @prop {string} [origin_path] Path to the Resource before moving to the Trash (for Resource in the Trash bin)
 * @prop {string} md5 MD5 hash sum of the file
 * @prop {('dir'|'file')} type Resource type: directory or file
 * @prop {string} mime_type MIME-type
 * @prop {number} size File size in bytes
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#resource
 */

/**
 * @callback MetaSuccessCallback
 * @param {Resource} data Meta data
 * @param {number} status Response status code
 */

/**
 * Request meta-info for the resource (file or folder)
 * @see https://tech.yandex.com/disk/api/reference/meta-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} [options={}] Additional options
 * @param {string} [options.sort] Sorting attribute name: (name, path, created, modified, size)
 * @param {number} [options.limit] Number of resources in response
 * @param {number} [options.offset] Offset of the resources list
 * @param {string} [options.preview_size] Size of the preview for the image resource
 * @param {boolean} [options.preview_crop] Crop preview of the image resource if true
 * @param {MetaSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
 * @see https://tech.yandex.com/disk/api/reference/meta-add-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} props Object with additional properties
 * @param {MetaSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
