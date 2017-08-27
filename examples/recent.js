import recent from '../src/recent';

const API_TOKEN = '';

recent(API_TOKEN, {media_type: 'image'}, ({items}) =>
  items.forEach((f) =>
    process.stdout.write(`${f.name} (${f.size}B)`)));
