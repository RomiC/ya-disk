import { remove } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const removePath = 'disk:/new_folder';

remove(
  API_TOKEN,
  removePath,
  true,
  () => console.log('Folder has been removed!'),
  console.error
);
