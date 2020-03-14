import list from '../lib/list';

const { API_TOKEN = '' } = process.env;

list(API_TOKEN, {}, ({ items }) =>
  items.forEach(({ name, size }) => process.stdout.write(`${name}: ${size}B`))
);
