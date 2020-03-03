import recent from '../lib/recent';

const { API_TOKEN = '' } = process.env;

recent(API_TOKEN, { media_type: 'image' }, ({ items }) =>
  items.forEach((f) => process.stdout.write(`${f.name} (${f.size}B)`))
);
