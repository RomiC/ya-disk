import { createWriteStream } from 'fs';
// Thi is lib is neccessary, beacause of Yandex Disk
// returns a 302 header when you try to download file
// using provided link
import { https } from 'follow-redirects';
import { parse } from 'url';
import download from '../src/download';

const API_TOKEN = '';
const file = 'disk:/Зима.jpg';

download.link(API_TOKEN, file, ({method, href}) => {
  const output = createWriteStream('Зима.jpg');
  const req = https.get(href, (res) => {
    res.on('end', () => output.end());
    res.pipe(output);
  });

  req.on('error', console.error);
  req.end();
}, function(err) {
  console.error(err);
});
