import upload from '../lib/upload.js';

const { API_TOKEN = '' } = process.env;
const url = 'http://africau.edu/images/default/sample.pdf';
const path = 'disk:/Приложения/ya-disk-api/sample.pdf';

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
