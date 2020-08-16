/**
 * General information about the disk
 * @module ya-disk/info
 */
const request = require('./request');
const { API_DISK_URL } = require('./constants');

/**
 * @typedef {object} Disk
 * @prop {number} trash_size Trash bin size in bytes
 * @prop {number} total_space Total size of disk in bytes
 * @prop {number} used_space Used volume in bytes
 * @prop {object} system_folders Absolute paths to the system folders
 * @prop {string} system_folders.downloads Path to Downloads folder
 * @prop {string} system_folders.applications Path to the Applications root folder
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#disk
 */

/**
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * @callback InfoSuccessCallback
 * @param {Disk} data Disk data
 * @param {number} status Response status code
 */

/**
 * Getting info about the disk info
 * @see https://tech.yandex.com/disk/api/reference/capacity-docpage/
 * @param {string} token OAuth token
 * @param {InfoSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const info = (token, success, error) =>
  request.get(
    {
      url: API_DISK_URL,
      token: token
    },
    success,
    error
  );

module.exports = info;
