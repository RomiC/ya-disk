import { createWriteStream } from 'fs';
// This lib is necessary, because of Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import followRedirects from 'follow-redirects';
import download from '../lib/download.js';

const { API_TOKEN = '' } = process.env;
// Replace this path with the real path from your disk
const file = 'disk:/Зима.png';

(async () => {
  try {
    const { href } = await download.link(API_TOKEN, file);
    const output = createWriteStream('Зима.jpg');
    const req = followRedirects.https.get(href, (res) => {
      res.on('end', () => output.end());
      res.pipe(output);
    });

    req.on('error', (err) => {
      throw err;
    });
    req.end();
  } catch (err) {
    console.error(err);
  }
})();
