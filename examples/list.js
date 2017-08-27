import list from '../src/list';

const API_TOKEN = '';

list(API_TOKEN, {}, ({items}) =>
  items.forEach(({name, size}) =>
    process.stdout.write('%s: %dB', name, size)));
