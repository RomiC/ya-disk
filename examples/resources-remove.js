import { remove } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const removePath = 'disk:/new_folder';

(async () => {
  try {
    await remove(API_TOKEN, removePath);
    console.log('Folder has been removed!');
  } catch (error) {
    console.error(error);
  }
})();
