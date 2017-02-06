const request = require('./request');

const {API_DOWNLOAD_LINK_URL} = require('./constants');

/**
 * Get download link for the file
 * @param {string} token OAuth token
 * @param {string} path Path to the file
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const link = (token, path, success, error) => {
  request.do({
    url: API_DOWNLOAD_LINK_URL,
    token: token,
    query: {
      path: path
    }
  }, success, error);
};

module.exports = {
  link
};