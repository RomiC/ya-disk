/**
 * @typedef ApiResponse
 * @type {object}
 * @prop {object} data Response payload
 * @prop {number} status Response status code
 */

/**
 * @typedef Link
 * @type {object}
 * @prop {string} href Download url (could be templated)
 * @prop {string} method Request method (GET, POST, etc.)
 * @prop {boolean} templated If true, URL should be templated before requesting (https://tools.ietf.org/html/rfc6570)
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#link
 */

/**
 * @typedef Resource
 * @type {object}
 * @prop {string} [public_key] Public key of the Resource
 *                                 (only for shared Resources)
 * @prop {string} [public_url] Public link to the Resource
 *                                 (only for shared Resources)
 * @prop {ResourceList} [_embedded] Resources of the folder
 * @prop {string} preview Preview image of the resource
 *                            (for supported graphic files)
 * @prop {string} name Resource name
 * @prop {object} custom_properties Hash-map of properties added via meta-method
 * @prop {string} created Creation date in ISO 8601.
 * @prop {string} modified Modification date in ISO 8601.
 * @prop {string} path Absolute path to the Resource
 * @prop {string} [origin_path] Path to the Resource before moving to the Trash.
 *                                  (for Resource in the Trash bin)
 * @prop {string} md5 MD5 hash sum of the file
 * @prop {('dir'|'file')} type Resource type: directory or file
 * @prop {string} mime_type MIME-type
 * @prop {number} size File size in bytes
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#resource
 */

/**
 * @typedef ResourceList
 * @type {object}
 * @prop {string} sort Sort field
 * @prop {string} [public_key] Public key of shared folder
 * @prop {Array<Resource>} items Array of items
 * @prop {number} limit Resources list limit
 * @prop {number} offset Resources list offset
 * @prop {string} path Folder's path
 * @prop {number} total Total amount of items in folder
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#resourcelist
 */

/**
 * @typedef FilesResourceList
 * @type {object}
 * @prop {Array<Resource>} items Array of the recently uploaded files
 * @prop {number} limit Files list limit
 * @prop {number} offset Files list offset
 * @see https://tech.yandex.com/disk/api/reference/response-objects-docpage/#filesresourcelist
 */
