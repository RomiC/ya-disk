import { createReadStream } from 'fs';
import { request } from 'https';
import { parse } from 'url';
import upload from '../lib/upload';

const { API_TOKEN = '' } = process.env;
const remotePath = 'disk:/Приложения/ya-disk-api/package.json';
const fileToUpload = './package.json';

(async () => {
  try {
    const { href, method } = await upload.link(API_TOKEN, remotePath, true);
    const fileStream = createReadStream(fileToUpload);
    const uploadStream = request({ ...parse(href), method });

    fileStream.pipe(uploadStream);
    fileStream.on('end', () => uploadStream.end());
  } catch (error) {
    console.error(error);
  }
})();
