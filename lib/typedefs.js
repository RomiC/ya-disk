/**
 * @typedef ApiResponse
 * @type {object}
 * @property {object} data Response payload
 * @property {number} status Response status code
 */

/**
 * @typedef Link
 * @type {object}
 * @property {string} href Download url (could be templated)
 * @property {string} method Request method (GET, POST, etc.)
 * @property {boolean} templated If true, URL should be templated before requesting (https://tools.ietf.org/html/rfc6570)
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#link
 */

/**
 * @typedef Resource
 * @type {object}
 * @property {string} [public_key] Public key of the Resource
 *                                 (only for shared Resources)
 * @property {string} [public_url] Public link to the Resource
 *                                 (only for shared Resources)
 * @property {ResourceList} [_embedded] Resources of the folder
 * @property {string} preview Preview image of the resource
 *                            (for supported graphic files)
 * @property {string} name Resource name
 * @property {Object} custom_properties Hash-map of properties added via meta-method
 * @property {string} created Creation date in ISO 8601.
 * @property {string} modified Modification date in ISO 8601.
 * @property {string} path Absolute path to the Resource
 * @property {string} [origin_path] Path to the Resource before moving to the Trash.
 *                                  (for Resource in the Trash bin)
 * @property {string} md5 MD5 hash sum of the file
 * @property {('dir'|'file')} type Resource type: directory or file
 * @property {string} mime_type MIME-type
 * @property {number} size File size in bytes
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#resource
 */

/**
 * @typedef ResourceList
 * @type {object}
 * @property {string} sort Sort field
 * @property {string} [public_key] Public key of shared folder
 * @property {Array<Resource>} items Array of items
 * @property {number} limit Resources list limit
 * @property {number} offset Resources list offset
 * @property {string} path Folder's path
 * @property {number} total Total amount of items in folder
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#resourcelist
 */

/**
 * @typedef FilesResourceList
 * @type {object}
 * @property {Array<Resource>} items Array of the recently uploaded files
 * @property {number} limit Files list limit
 * @property {number} offset Files list offset
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#filesresourcelist
 */
