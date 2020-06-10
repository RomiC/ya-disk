import { copy } from '../lib/resources';

const { API_TOKEN = '' } = process.env;
const from = 'disk:/Зима.png';
const to = 'disk:/new_folder/Зима.png';

(async () => {
  try {
    await copy(API_TOKEN, from, to, true);
  } catch (error) {
    console.error(error);
  }
})();
