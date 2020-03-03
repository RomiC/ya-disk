const request = require('./request');

const { API_OPERATIONS_URL } = require('./constants');

/**
 * Get operation status
 * @see https://tech.yandex.ru/disk/api/reference/operations-docpage/
 * @param {string} token OAuth token
 * @param {id} id Operation ID
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
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
