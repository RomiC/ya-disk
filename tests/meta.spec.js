const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const meta = require('../lib/meta');

const { API_TOKEN } = require('./constants');
const { API_RESOURCES_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const path = 'disk:/file1.txt';
const options = {
  sort: 'created',
  limit: 13,
  offset: 9,
  preview_size: 'x120',
  preview_crop: true
};
const custom_properties = {
  uno: 'value1',
  duos: {
    tres: 'tres',
    cuatro: 'cuatro'
  }
};

afterEach(() => mock.restoreAll());

describe('get', () => {
  test('should call request.get method with correct params and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        name: 'photo2.png',
        preview: 'https://downloader.disk.yandex.ru/preview/...',
        created: '2014-04-22T14:57:13+04:00',
        modified: '2014-04-22T14:57:14+04:00',
        path: 'disk:/foo/photo2.png',
        md5: '53f4dc6379c8f95ddf11b9508cfea271',
        type: 'file',
        mime_type: 'image/png',
        size: 54321
      },
      status: 200
    };
    const metaGetPromise = meta.get(API_TOKEN, path, options);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path, ...options }
    });

    requestGetMock._resolve(responseMock);

    const result = await metaGetPromise;
    assert.equal(result, responseMock.data);
  });

  test('should append empty object when options is mised', () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    meta.get(API_TOKEN, path);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path }
    });
  });
});

describe('add', () => {
  test('should call request.patch with proper params and resolve Promise with data', async () => {
    const requestPatchMock = createRequestMock();
    mock.method(request, 'patch', requestPatchMock);

    const responseMock = {
      data: {
        name: 'photo2.png',
        preview: 'https://downloader.disk.yandex.ru/preview/...',
        created: '2014-04-22T14:57:13+04:00',
        modified: '2014-04-22T14:57:14+04:00',
        path: 'disk:/foo/photo2.png',
        md5: '53f4dc6379c8f95ddf11b9508cfea271',
        type: 'file',
        mime_type: 'image/png',
        size: 54321
      },
      status: 200
    };

    const metaAddPromise = meta.add(API_TOKEN, path, custom_properties);

    assert.deepStrictEqual(request.patch.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path },
      data: { custom_properties }
    });

    requestPatchMock._resolve(responseMock);

    const result = await metaAddPromise;
    assert.equal(result, responseMock.data);
  });
});
