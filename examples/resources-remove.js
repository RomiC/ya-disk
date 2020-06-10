import { remove } from '../lib/resources';

const { API_TOKEN = '' } = process.env;
const removePath = 'disk:/new_folder';

(async () => {
  try {
    await remove(API_TOKEN, removePath);
  } catch (error) {
    console.error(error);
  }
})();
