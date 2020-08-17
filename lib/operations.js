/**
 * Operations status obtaining
 * @module ya-disk/operations
 */
const request = require('./request');

const { API_OPERATIONS_URL } = require('./constants');

/**
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 */

/**
 * @typedef {object} Operation
 * @property {('success' | 'failed' | 'in-progress')} status Operation status:
 *                                                           - success - operation succeed
 *                                                           - failed - operation failed, pls retry
 *                                                           - in-progress - operation started, but not finished yet
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#operation
 */

/**
 * @callback OperationSuccessCallback
 * @param {Operation} data Operation data
 * @param {number} status Request status code
 */

/**
 * Get operation status
 * @see https://tech.yandex.com/disk/api/reference/operations-docpage/
 * @param {string} token OAuth token
 * @param {id} id Operation ID
 * @param {OperationSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
 */
const operations = (token, id, success, error) =>
  request.get(
    {
      url: `${API_OPERATIONS_URL}/${id}`,
      token: token
    },
    success,
    error
  );

module.exports = operations;
