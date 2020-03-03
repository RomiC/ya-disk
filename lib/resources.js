const request = require('./request');

const {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL
} = require('./constants');

/**
 * Create Folder
 * @see https://tech.yandex.com/disk/api/reference/create-folder-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] Path
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const create = (token, path, success, error) =>
  request.put(
    {
      url: API_RESOURCES_URL,
      token: token,
      query: {
        path: path
      }
    },
    success,
    error
  );

/**
 * Remove File or Folder
 * @see https://tech.yandex.com/disk/api/reference/delete-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] File or Folder Path
 * @param {boolean} [permanently] permanently default false
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const remove = (token, path, permanently = false, success, error) =>
  request.delete(
    {
      url: API_RESOURCES_URL,
      token: token,
      query: {
        path: path,
        permanently: permanently
      }
    },
    success,
    error
  );

/**
 * Copy or move File or Folder, helper method to avoid code duplication
 * @param {string} url copy or move url
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to copy/move from
 * @param {string} path File or Folder Path to copy/move to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const copyOrMove = (
  url,
  token,
  from,
  path,
  overwrite = false,
  fields = '',
  success,
  error
) =>
  request.post(
    {
      url: url,
      token: token,
      query: {
        from: from,
        path: path,
        overwrite: overwrite,
        fields: fields
      }
    },
    success,
    error
  );

/**
 * Copy File or Folder
 * @see https://tech.yandex.com/disk/api/reference/copy-docpage/
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to copy from
 * @param {string} path File or Folder Path to copy to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const copy = (
  token,
  from,
  path,
  overwrite = false,
  fields = '',
  success,
  error
) =>
  copyOrMove(
    API_COPY_URL,
    token,
    from,
    path,
    overwrite,
    fields,
    success,
    error
  );

/**
 * Move File or Folder
 * @see https://tech.yandex.com/disk/api/reference/move-docpage/
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to move from
 * @param {string} path File or Folder Path to move to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @param {function} [success] Success callback
 * @param {function} [error] Error callback
 */
const move = (
  token,
  from,
  path,
  overwrite = false,
  fields = '',
  success,
  error
) =>
  copyOrMove(
    API_MOVE_URL,
    token,
    from,
    path,
    overwrite,
    fields,
    success,
    error
  );

module.exports = {
  create,
  remove,
  copy,
  move
};
