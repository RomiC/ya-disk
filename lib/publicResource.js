/**
 * Working with public resources
 * @module ya-disk/publicResource
 */
const request = require('./request');

const {
  API_PUBLIC_URL,
  API_PUBLIC_RESOURCES_URL,
  API_PUBLIC_DOWNLOAD_URL,
  API_SAVE_TO_DISK_URL
} = require('./constants');

/**
 * @typedef {import('./meta').Resource} Resource
 * @typedef {import('./download').Link} Link
 *
 * @typedef {object} PublicResourceGetOptions
 * @prop {string} [path] Relative path to a resource in the public folder
 * @prop {string} [sort] Sort field for folder items: name, path, created, modified, size
 * @prop {number} [limit] Maximum number of described nested resources
 * @prop {number} [offset] Number of resources to skip from the top of the list
 * @prop {string} [preview_size] Preview size for supported image resources
 * @prop {boolean} [preview_crop] Crop preview image if true
 *
 * @typedef {object} PublicResourceListOptions
 * @prop {number} [limit] Maximum number of published resources in response
 * @prop {number} [offset] Number of resources to skip from the top of the list
 * @prop {('file'|'dir')} [type] Resource type filter
 * @prop {string} [fields] Comma-separated list of fields to include in response
 * @prop {string} [preview_size] Preview size for supported image resources
 */

/**
 * Request meta-information for a public resource
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {PublicResourceGetOptions} [options={}] Additional query options
 * @returns {Promise<Resource, Error>} Promise resolved with resource metadata
 */
const get = async (token, public_key, options = {}) =>
  (
    await request.get({
      url: API_PUBLIC_RESOURCES_URL,
      token,
      query: { public_key, ...options }
    })
  ).data;

/**
 * Request download link for a public resource
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {string} [path] Relative path in public folder
 * @returns {Promise<Link, Error>} Promise resolved with download link
 */
const download = async (token, public_key, path) =>
  (
    await request.get({
      url: API_PUBLIC_DOWNLOAD_URL,
      token,
      query: { public_key, path }
    })
  ).data;

/**
 * Save a public resource to the Downloads folder
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {string} [path] Relative path in public folder
 * @param {string} [name] New name for saved resource
 * @returns {Promise<Link, Error>} Promise resolved with result link
 */
const saveToDisk = async (token, public_key, path, name) =>
  (
    await request.post({
      url: API_SAVE_TO_DISK_URL,
      token,
      query: { public_key, path, name }
    })
  ).data;

/**
 * Get list of user published resources
 * @see https://yandex.com/dev/disk-api/doc/en/reference/recent-public
 * @param {string} token OAuth token
 * @param {PublicResourceListOptions} [options] Additional query parameters
 * @returns {Promise<{items: Resource[]}, Error>} Promise resolved with published resources list
 */
const list = async (token, options) =>
  (
    await request.get({
      url: API_PUBLIC_URL,
      token,
      query: options
    })
  ).data;

module.exports = {
  get,
  download,
  saveToDisk,
  list
};
