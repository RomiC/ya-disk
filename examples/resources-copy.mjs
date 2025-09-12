import { copy } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const from = 'disk:/Зима.png';
const to = 'disk:/new_folder/Зима.png';

(async () => {
  try {
    await copy(API_TOKEN, from, to, true);
    console.log('File has been copied!');
  } catch (error) {
    console.error(error);
  }
})();
