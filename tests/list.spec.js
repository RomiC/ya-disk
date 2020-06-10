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

test('should call request.get with proper params and resolve Promise with data', () => {
  const responseMock = {
    data: {
      items: [
        {
          name: 'photo2.png',
          preview: 'https://downloader.disk.yandex.ru/preview/...',
          created: '2014-04-22T14:57:13+04:00',
          modified: '2014-04-22T14:57:14+04:00',
          path: 'disk:/foo/photo2.png',
          md5: '53f4dc6379c8f95ddf11b9508cfea271',
          type: 'file',
          mime_type: 'image/png',
          size: 54321
        }
      ],
      limit: 20,
      offset: 0
    }
  };
  const listPromise = list(API_TOKEN, options);

  expect(request.get).toHaveBeenCalledWith({
    url: API_FILES_URL,
    token: API_TOKEN,
    query: options
  });

  request.get._resolve(responseMock);

  expect(listPromise).resolves.toBe(responseMock.data);
});
