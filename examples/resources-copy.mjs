import { copy } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const from = 'disk:/Зима.png';
const to = 'disk:/new_folder/Зима.png';

copy(
  API_TOKEN,
  from,
  to,
  true,
  '',
  () => console.log('File has been copied!'),
  console.error
);
