/**
 * General information about the disk
 * @module ya-disk/info
 */
const request = require('./request');
const { API_DISK_URL } = require('./constants');

/**
 * @typedef Disk
 * @type {object}
 * @prop {number} trash_size Trash bin size in bytes
 * @prop {number} total_space Total size of disk in bytes
 * @prop {number} used_space Used volume in bytes
 * @prop {object} system_folders Absolute paths to the system folders
 * @prop {string} system_folders.downloads Path to Downloads folder
 * @prop {string} system_folders.applications Path to the Applications root folder
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#disk
 */

/**
 * Getting info about the disk info
 * @see https://tech.yandex.com/disk/api/reference/capacity-docpage/
 * @param {string} token OAuth token
 * @returns {Promise<Disk, Error>} Promise to be resolved on getting info
 */
const info = async (token) =>
  (
    await request.get({
      url: API_DISK_URL,
      token
    })
  ).data;

module.exports = info;
