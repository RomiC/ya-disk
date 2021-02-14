import recent from '../lib/recent.js';

const { API_TOKEN = '' } = process.env;

recent(API_TOKEN, { media_type: 'image' }, ({ items }) =>
  items.forEach((f) => console.log(`${f.name} (${f.size}B)`))
);
