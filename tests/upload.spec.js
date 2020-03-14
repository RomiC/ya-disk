const request = require('../lib/request');
const { link, remoteFile } = require('../lib/upload');

const { API_TOKEN } = require('./constants');
const { API_UPLOAD_LINK_URL } = require('../lib/constants');

const path = 'disk:/file.txt';
const overwrite = true;
const url = 'https://example.com/file.txt';
const onSuccessCallback = jest.fn();
const onErrorCallback = jest.fn();

jest.mock('../lib/request');

test('link', () => {
  link(API_TOKEN, path, overwrite, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        path: path,
        overwrite: overwrite
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('remoteFile', () => {
  remoteFile(API_TOKEN, url, path, onSuccessCallback, onErrorCallback);

  expect(request.post).toHaveBeenCalledWith(
    {
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        url: url,
        path: path
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});
