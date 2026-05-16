import downloadDefault from './lib/download.js';
import infoDefault from './lib/info.js';
import listDefault from './lib/list.js';
import metaDefault from './lib/meta.js';
import operationsDefault from './lib/operations.js';
import publicResourcesDefault from './lib/publicResource.js';
import recentDefault from './lib/recent.js';
import trashDefault from './lib/trash.js';
import uploadDefault from './lib/upload.js';
import resourcesDefault from './lib/resources.js';

export const download = downloadDefault;
export const info = infoDefault;
export const list = listDefault;
export const meta = metaDefault;
export const operations = operationsDefault;
export const publicResources = publicResourcesDefault;
export const recent = recentDefault;
export const trash = trashDefault;
export const upload = uploadDefault;
export const resources = resourcesDefault;

export default {
  download,
  info,
  list,
  meta,
  operations,
  publicResources,
  recent,
  trash,
  upload,
  resources
};
