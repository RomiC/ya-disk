import list from '../lib/list.js';

const { API_TOKEN = '' } = process.env;

list(API_TOKEN, {}, ({ items }) =>
  items.forEach(({ name, size }) => console.log(`${name}: ${size}B`))
);
