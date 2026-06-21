const assert = require('node:assert/strict');
const { afterEach, mock, test } = require('node:test');

const request = require('../lib/request');
const list = require('../lib/list');

const { API_TOKEN } = require('./constants');
const { API_FILES_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const options = {
  limit: 13,
  media_type: 'diskimage,settings,image',
  offset: 3,
  preview_size: '130x',
  preview_crop: true
};

afterEach(() => mock.restoreAll());

test('should call request.get with proper params and resolve Promise with data', async () => {
  const requestGetMock = createRequestMock();
  mock.method(request, 'get', requestGetMock);

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

  assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
    url: API_FILES_URL,
    token: API_TOKEN,
    query: options
  });

  requestGetMock._resolve(responseMock);

  const result = await listPromise;
  assert.equal(result, responseMock.data);
});
