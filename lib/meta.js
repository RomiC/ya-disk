/**
 * Working with resource meta-info
 * @module ya-disk/meta
 */
const request = require('./request');
require('./typedefs');

const { API_RESOURCES_URL } = require('./constants');

/**
 * Request meta-info for the resource (file or folder)
 * @see https://tech.yandex.com/disk/api/reference/meta-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} [options={}] Additional options
 * @param {string} [options.fields] List of fields to be included into the response
 * @param {string} [options.sort] Sorting attribute name: (name, path, created, modified, size)
 * @param {number} [options.limit] Number of resources in response
 * @param {number} [options.offset] Offset of the resources list
 * @param {string} [options.preview_size] Size of the preview for the image resource
 * @param {boolean} [options.preview_crop] Crop preview of the image resource if true
 * @returns {Promise<Resource|Error>} Promise to be resolved on getting meta-info
 */
const get = async (token, path, options = {}) =>
  (
    await request.get({
      url: API_RESOURCES_URL,
      token,
      query: { path, ...options }
    })
  ).data;

/**
 * Append meta-info to the resource (file or folder)
 * @see https://tech.yandex.com/disk/api/reference/meta-add-docpage/
 * @param {string} token OAuth token
 * @param {string} path Path to the resource
 * @param {object} props Object with additional properties
 * @returns {Promise<Resource|Error>} Promise to be resolved on appending meta-info
 */
const add = async (token, path, props) =>
  (
    await request.patch({
      url: API_RESOURCES_URL,
      token,
      query: {
        path
      },
      data: {
        custom_properties: props
      }
    })
  ).data;

module.exports = {
  get,
  add
};
