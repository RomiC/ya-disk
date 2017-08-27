import list from '../lib/list';

const API_TOKEN = '';

list(
  API_TOKEN,
  {},
  ({ items }) => items.forEach(({ name, size }) =>
    process.stdout.write(`${name}: ${size}B`))
);