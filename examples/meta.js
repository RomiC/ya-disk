import meta from '../lib/meta';

const API_TOKEN = '';

meta.add(
  API_TOKEN,
  'disk:/Зима.jpg',
  { my_field: 'my_value' },
  null,
  (err) => process.stderror.write(err.message)
);

meta.get(
  API_TOKEN,
  'disk:/Зима.jpg',
  {},
  (data) => process.stdout.write(data)
);