/**
 * Operations status obtaining
 * @module ya-disk/operations
 */
const request = require('./request');

const { API_OPERATIONS_URL } = require('./constants');

/**
 * @typedef Operation
 * @type {object}
 * @prop {('success' | 'failed' | 'in-progress')} status Operation status:
 * 							                                         - success - operation succeed
 * 							                                         - failed - operation failed, pls retry
 * 							                                         - in-progress - operation started, but not finished yet
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#operation
 */

/**
 * Get operation status
 * @see https://tech.yandex.com/disk/api/reference/operations-docpage/
 * @param {string} token OAuth token
 * @param {string} id Operation ID
 * @returns {Promise<Operation, Error>} Promise to be resolved with operation statius
 */
const operations = async (token, id) =>
  (
    await request.get({
      url: `${API_OPERATIONS_URL}/${id}`,
      token
    })
  ).data;

module.exports = operations;
