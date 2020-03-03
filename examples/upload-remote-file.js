import upload from '../lib/upload';

const { API_TOKEN = '' } = process.env;
const url = 'https://tech.yandex.com/disk/doc/dg/yandex-disk-dg.pdf';
const path = 'disk:/Приложения/ya-disk-api/yandex-disk-dg.pdf';

upload.remoteFile(
  API_TOKEN,
  url,
  path,
  ({ href }) => {
    process.stdout.write(`File upload started!
You can check the operation status by url below:
${href}
  \n`);
  },
  (err) => process.stderror.write(err.message)
);
