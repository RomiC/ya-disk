const info = require('../lib/info');
const request = require('../lib/request');

const { API_DISK_URL } = require('../lib/constants');
const { API_TOKEN } = require('./constants');

jest.mock('../lib/request');

test('should call request.do with correct params', () => {
  const onSuccessCallback = jest.mock();
  const onErrorCallback = jest.mock();

  info(API_TOKEN, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_DISK_URL,
      token: API_TOKEN
    },
    onSuccessCallback,
    onErrorCallback
  );
});
