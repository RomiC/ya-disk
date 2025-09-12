import { createWriteStream } from 'fs';
// This lib is neccessary, beacause of Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import followRedirects from 'follow-redirects';
import download from '../lib/download.js';

const { API_TOKEN = '' } = process.env;
// Replace this path with the real path from your disk
const file = 'disk:/Приложения/ya-disk-api/package.json';

download.link(
  API_TOKEN,
  file,
  ({ href }) => {
    const output = createWriteStream('package-yd.jpg');
    const req = followRedirects.https.get(href, (res) => {
      res.on('end', () => output.end());
      res.pipe(output);
    });

    req.on('error', console.error);
    req.end();
  },
  console.error
);
