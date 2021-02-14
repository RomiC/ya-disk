import { createReadStream } from 'fs';
import { request } from 'https';
import { parse } from 'url';

import upload from '../lib/upload.js';

const { API_TOKEN = '' } = process.env;

upload.link(
  API_TOKEN,
  'disk:/Приложения/ya-disk-api/package.json',
  true,
  ({ href, method }) => {
    createReadStream('./package.json')
      .on('end', () => console.log('completed!'))
      .pipe(request(Object.assign(parse(href), { method })))
      .on('error', console.error);
  },
  (err) => process.stderror.write(err.message)
);
