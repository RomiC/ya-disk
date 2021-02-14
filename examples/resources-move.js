import { move } from '../lib/resources.js';

const { API_TOKEN = '' } = process.env;
const from = 'disk:/Capture.PNG';
const to = 'disk:/new_folder/Capture.PNG';

move(
  API_TOKEN,
  from,
  to,
  true,
  '',
  () => console.log('File has been moved!'),
  console.error
);
