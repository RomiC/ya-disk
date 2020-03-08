const request = require('../lib/request');
const recent = require('../lib/recent');

const { API_TOKEN } = require('./constants');
const { API_RECENT_FILES_URL } = require('../lib/constants');

const options = {
  limit: 13,
  media_type: 'backup,book,audio',
  preview_size: '130x',
  preview_crop: false
};

jest.mock('../lib/request');

test('should call request.get with correct params', () => {
  const onSuccessCallback = jest.fn();
  const onErrorCallback = jest.fn();

  recent(API_TOKEN, options, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_RECENT_FILES_URL,
      token: API_TOKEN,
      query: options
    },
    onSuccessCallback,
    onErrorCallback
  );
});
