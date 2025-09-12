import meta from '../lib/meta.js';

const { API_TOKEN = '' } = process.env;

meta.add(
  API_TOKEN,
  'disk:/Capture.PNG',
  { my_field: 'my_value' },
  null,
  console.error
);

meta.get(
  API_TOKEN,
  'disk:/Capture.PNG',
  {},
  (data) => console.log(data.custom_properties),
  console.error
);
