import { create } from '../lib/resources';

const { API_TOKEN = '' } = process.env;
const newFolderPath = 'disk:/new_folder';

(async () => {
  try {
    await create(API_TOKEN, newFolderPath);
  } catch (error) {
    console.error(error);
  }
})();
