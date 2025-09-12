import { create } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const newFolderPath = 'disk:/new_folder';

create(
  API_TOKEN,
  newFolderPath,
  () => console.log('Folder has been created!'),
  console.error
);
