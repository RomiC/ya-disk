const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const { link, remoteFile } = require('../lib/upload');

const { API_TOKEN } = require('./constants');
const { API_UPLOAD_LINK_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const path = 'disk:/file.txt';
const overwrite = true;
const url = 'https://example.com/file.txt';

afterEach(() => mock.restoreAll());

describe('link', () => {
  test('should call request.get with proper params and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        href: 'https://uploader1d.dst.yandex.net:443/upload-target/',
        method: 'PUT',
        templated: false
      },
      status: 200
    };
    const linkPromise = link(API_TOKEN, path, overwrite);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        path,
        overwrite
      }
    });

    requestGetMock._resolve(responseMock);

    const result = await linkPromise;
    assert.equal(result, responseMock.data);
  });

  test("shouldn't overwrite currently existed resource by default", () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    link(API_TOKEN, path);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: { path, overwrite: false }
    });
  });
});

describe('remoteFile', () => {
  test('should call request.post with proper params and resolve Promise with data', async () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const remoteFilePromise = remoteFile(API_TOKEN, url, path);

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        url,
        path
      }
    });

    requestPostMock._resolve(responseMock);

    const result = await remoteFilePromise;
    assert.equal(result, responseMock.data);
  });
});
