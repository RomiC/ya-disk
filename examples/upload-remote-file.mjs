import upload from '../lib/upload.js';

const { API_TOKEN = '' } = process.env;
const url = 'https://tech.yandex.com/disk/doc/dg/yandex-disk-dg.pdf';
const path = 'disk:/Приложения/ya-disk-api/yandex-disk-dg.pdf';

(async () => {
  try {
    const { href: operationStatusLink } = await upload.remoteFile(
      API_TOKEN,
      url,
      path
    );
    console.log(`File upload started!
You can check the operation status by url below:
      ${operationStatusLink}
  \n`);
  } catch (error) {
    console.error(error);
  }
})();
