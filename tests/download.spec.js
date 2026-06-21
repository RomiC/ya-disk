const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const { link } = require('../lib/download');

const { API_TOKEN } = require('./constants');
const { API_DOWNLOAD_LINK_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const path = 'disk:/file.txt';

afterEach(() => mock.restoreAll());

describe('link', () => {
  test('should call request.get method with correct params and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        href: 'https://yandex.ru/disk/download/file.txt',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const linkPromise = link(API_TOKEN, path);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_DOWNLOAD_LINK_URL,
      token: API_TOKEN,
      query: { path }
    });

    requestGetMock._resolve(responseMock);

    const result = await linkPromise;
    assert.equal(result, responseMock.data);
  });
});
