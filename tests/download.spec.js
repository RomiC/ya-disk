const request = require('../lib/request');
const { link } = require('../lib/download');

const { API_TOKEN } = require('./constants');
const { API_DOWNLOAD_LINK_URL } = require('../lib/constants');

const path = 'disk:/file.txt';

jest.mock('../lib/request');

test('should call request.do method with correct params', () => {
  const onSuccessCallback = jest.fn();
  const onErrorCallback = jest.fn();

  link(API_TOKEN, path, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_DOWNLOAD_LINK_URL,
      token: API_TOKEN,
      query: { path }
    },
    onSuccessCallback,
    onErrorCallback
  );
});
