import { createWriteStream } from 'fs';
// Thi is lib is neccessary, beacause of Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import { https } from 'follow-redirects';
import download from '../lib/download';

const API_TOKEN = '';
const file = 'disk:/Зима.jpg';

download.link(
  API_TOKEN,
  file,
  ({ href }) => {
    const output = createWriteStream('Зима.jpg');
    const req = https.get(href, (res) => {
      res.on('end', () => output.end());
      res.pipe(output);
    });

    req.on('error', (err) => process.stderror.write(err));
    req.end();
  },
  (err) => process.stderror.write(err)
);