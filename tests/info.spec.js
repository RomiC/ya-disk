const assert = require('node:assert/strict');
const { afterEach, mock, test } = require('node:test');

const info = require('../lib/info');
const request = require('../lib/request');

const { API_DISK_URL } = require('../lib/constants');
const { API_TOKEN } = require('./constants');

const { createRequestMock } = require('./test-helper');

afterEach(() => mock.restoreAll());

test('should call request.get with correct params and resolve Promise with data', async () => {
  const requestGetMock = createRequestMock();
  mock.method(request, 'get', requestGetMock);

  const responseMock = {
    data: {
      total_space: 10 * 1024 * 1024 * 1024,
      trash_size: 2 * 1024 * 1024,
      used_space: 3 * 1024 * 1024 * 1024
    },
    status: 200
  };

  const infoPromise = info(API_TOKEN);

  assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
    url: API_DISK_URL,
    token: API_TOKEN
  });

  requestGetMock._resolve(responseMock);

  const result = await infoPromise;
  assert.equal(result, responseMock.data);
});
