const request = require('../lib/request');
const list = require('../lib/list');

const { API_TOKEN } = require('./constants');
const { API_FILES_URL } = require('../lib/constants');

const options = {
  limit: 13,
  media_type: 'diskimage,settings,image',
  offset: 3,
  preview_size: '130x',
  preview_crop: true
};

jest.mock('../lib/request');

test('should call request.get with proper params', () => {
  const onSuccessCallback = jest.fn();
  const onErrorCallback = jest.fn();

  list(API_TOKEN, options, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_FILES_URL,
      token: API_TOKEN,
      query: options
    },
    onSuccessCallback,
    onErrorCallback
  );
});
