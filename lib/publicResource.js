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
 * @typedef {import('./request').RequestSuccessCallback} RequestSuccessCallback
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * Request meta-information for a public resource
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {object} [options={}] Additional query options
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const get = (token, public_key, options = {}, success, error) =>
  request.get(
    {
      url: API_PUBLIC_RESOURCES_URL,
      token: token,
      query: { public_key, ...options }
    },
    success,
    error
  );

/**
 * Request download link for a public resource
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {string} [path] Relative path in public folder
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const download = (token, public_key, path, success, error) =>
  request.get(
    {
      url: API_PUBLIC_DOWNLOAD_URL,
      token: token,
      query: { public_key, path }
    },
    success,
    error
  );

/**
 * Save a public resource to the Downloads folder
 * @see https://yandex.com/dev/disk-api/doc/en/reference/public
 * @param {string} token OAuth token
 * @param {string} public_key Public resource key or URL
 * @param {string} [path] Relative path in public folder
 * @param {string} [name] New name for saved resource
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const saveToDisk = (token, public_key, path, name, success, error) =>
  request.post(
    {
      url: API_SAVE_TO_DISK_URL,
      token: token,
      query: { public_key, path, name }
    },
    success,
    error
  );

/**
 * Get list of user published resources
 * @see https://yandex.com/dev/disk-api/doc/en/reference/recent-public
 * @param {string} token OAuth token
 * @param {object} [options] Additional query parameters
 * @param {RequestSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const list = (token, options, success, error) =>
  request.get(
    {
      url: API_PUBLIC_URL,
      token: token,
      query: options
    },
    success,
    error
  );

module.exports = {
  get,
  download,
  saveToDisk,
  list
};
