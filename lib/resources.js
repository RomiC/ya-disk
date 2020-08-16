/**
 * Copy/Move/Delete resources
 * @module ya-disk/resources
 */
const request = require('./request');

const {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL
} = require('./constants');

/**
 * @typedef {import('./download').Link} Link
 * @typedef {import('./request').RequestErrorCallback} RequestErrorCallback
 * @typedef {import('./meta').Resource} Resource
 */

/**
 * @callback CreateSuccessCallback
 * @param {Link} data Link to the meta-info about created folder
 * @param {number} status Response status code
 */

/**
 * Create Folder
 * @see https://tech.yandex.com/disk/api/reference/create-folder-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] Path
 * @param {CreateSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
 * @callback RemoveSuccessCallback
 * @param {(Link|null)} data If resource is non-empty folder it will link to operation status,
 *                           Otherwise null
 * @param {number} status Response operation status
 */

/**
 * Remove File or Folder
 * @see https://tech.yandex.com/disk/api/reference/delete-docpage/
 * @param {string} token OAuth token
 * @param {string} [path] File or Folder Path
 * @param {boolean} [permanently] permanently default false
 * @param {RemoveSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
 * @callback CopyMoveSuccessCallback
 * @param {Link} data In case of copying/moving non-empty folder return link to operation status,
 *                    otherwise link to the meta-info about copied/moved Resource
 * @param {number} status Response status code
 */

/**
 * Copy or move File or Folder, helper method to avoid code duplication
 * @param {string} url copy or move url
 * @param {string} token OAuth token
 * @param {string} from File or Folder Path to copy/move from
 * @param {string} path File or Folder Path to copy/move to
 * @param {boolean} [overwrite] overwrite default false
 * @param {string} [fields] Comma-separated list of fields to include in response
 * @param {CopyMoveSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
 * @param {CopyMoveSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
 * @param {CopyMoveSuccessCallback} [success] Success callback
 * @param {RequestErrorCallback} [error] Error callback
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
