const API_BASE_URL = 'https://cloud-api.yandex.net/v1';

/**
 * URL for requesting info about user disk: total space, free space, etc.
 * @see https://tech.yandex.ru/disk/api/reference/capacity-docpage/
 * @type {string}
 */
const API_DISK_URL = `${API_BASE_URL}/disk`;
/**
 * URL for requesting info about resource (file or path) on user disk,
 * also for deleting resource and adding meta info for the public resources
 * @see https://tech.yandex.ru/disk/api/reference/meta-docpage/
 * @see https://tech.yandex.ru/disk/api/reference/public-docpage/#meta
 *
 * @type {string}
 */
const API_RESOURCES_URL = `${API_DISK_URL}/resources`;

/**
 * URL for requesting flat list of files
 * @see https://tech.yandex.ru/disk/api/reference/all-files-docpage/
 * @type {string}
 */
const API_FILES_URL = `${API_RESOURCES_URL}/files`;
/**
 * URL for getting list of recently uploaded files
 * @see https://tech.yandex.ru/disk/api/reference/recent-upload-docpage/
 * @type {string}
 */
const API_RECENT_FILES_URL = `${API_RESOURCES_URL}/last-uploaded`;

/**
 * URL for requesting upload link for the file
 * @type {string}
 */
const API_UPLOAD_LINK_URL = `${API_RESOURCES_URL}/upload`;
/**
 * URL for getting download link for the file or public resource
 * @see https://tech.yandex.ru/disk/api/reference/upload-ext-docpage/
 * @see https://tech.yandex.ru/disk/api/reference/public-docpage/#download
 * @type {string}
 */
const API_DOWNLOAD_LINK_URL = `${API_RESOURCES_URL}/download`;

/**
 * URL for copying resource (file or folder)
 * @type {string}
 */
const API_COPY_URL = `${API_RESOURCES_URL}/copy`;
/**
 * URL for moving file or folder
 * @type {string}
 */
const API_MOVE_URL = `${API_RESOURCES_URL}/move`;

/**
 * URL for publishing (getting public url to) resource
 * @type {string}
 */
const API_PUBLISH_URL = `${API_RESOURCES_URL}/publish`;
/**
 * URL for unpublishing (closing public saccess to) resource
 * @type {string}
 */
const API_UNPUBLISH_URL = `${API_RESOURCES_URL}/unpublish`;

/**
 * URL for saving published resource to Download folder
 * @see https://tech.yandex.ru/disk/api/reference/public-docpage/#save
 * @type {string}
 */
const API_SAVE_TO_DISK_URL = `${API_RESOURCES_URL}/save-to-disk`;

/**
 * URL for getting list of published resources
 * @see https://tech.yandex.ru/disk/api/reference/recent-public-docpage/
 * @type {string}
 */
const API_PUBLIC_URL = `${API_RESOURCES_URL}/public`;

/**
 * URL for cleaning up the trash folder
 * @see https://tech.yandex.ru/disk/api/reference/trash-delete-docpage/
 * @type {string}
 */
const API_TRASH_URL = `${API_DISK_URL}/trash/resources`;
/**
 * URL for restoring files from the trash
 * @type {string}
 */
const API_RESTORE_URL = `${API_TRASH_URL}/restore`;

/**
 * URL for getting operation status
 * @type {string}
 */
const API_OPERATIONS_URL = `${API_DISK_URL}/operations`;

module.exports = {
  API_DISK_URL,
  API_RESOURCES_URL,
  API_FILES_URL,
  API_RECENT_FILES_URL,
  API_UPLOAD_LINK_URL,
  API_DOWNLOAD_LINK_URL,
  API_COPY_URL,
  API_MOVE_URL,
  API_PUBLISH_URL,
  API_UNPUBLISH_URL,
  API_SAVE_TO_DISK_URL,
  API_PUBLIC_URL,
  API_TRASH_URL,
  API_RESTORE_URL,
  API_OPERATIONS_URL
};
