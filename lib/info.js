const request = require('./request');
const { API_DISK_URL } = require('./constants');

/**
 * Getting info about the disk info
 * @see https://tech.yandex.ru/disk/api/reference/capacity-docpage/
 * @param {string} token OAuth token
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
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
