import meta from '../src/meta';

const API_TOKEN = 'AQAAAAAbX24dAAQB-z80p6HY-02ts2aztofaFeQ';

meta.add(
  API_TOKEN,
  'disk:/Зима.jpg',
  {my_field: 'my_value'},
  null,
  (err) => process.stderror.write(err.message)
);

meta.get(
  API_TOKEN,
  'disk:/Зима.jpg',
  {},
  (data) => process.stdout.write(data)
);
