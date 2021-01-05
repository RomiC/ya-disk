import { create } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const newFolderPath = 'disk:/new_folder';

(async () => {
  try {
    await create(API_TOKEN, newFolderPath);
    console.log('Folder has been created!');
  } catch (error) {
    console.error(error);
  }
})();
