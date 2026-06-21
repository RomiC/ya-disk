const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const trash = require('../lib/trash');

const { API_TOKEN } = require('./constants');
const { API_TRASH_URL, API_RESTORE_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const path = '/foo/photo.png';
const name = 'photo-restored.png';
const overwrite = true;

afterEach(() => mock.restoreAll());

describe('delete', () => {
  test('should call request.delete with path and resolve Promise with data and status', async () => {
    const requestDeleteMock = createRequestMock();
    mock.method(request, 'delete', requestDeleteMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
        method: 'GET',
        templated: false
      },
      status: 202
    };
    const deletePromise = trash.delete(API_TOKEN, path);

    assert.deepStrictEqual(request.delete.mock.calls[0].arguments[0], {
      url: API_TRASH_URL,
      token: API_TOKEN,
      query: { path }
    });

    requestDeleteMock._resolve(responseMock);

    const result = await deletePromise;
    assert.equal(result, responseMock);
  });

  test('should call request.delete without path to clear whole trash', () => {
    const requestDeleteMock = createRequestMock();
    mock.method(request, 'delete', requestDeleteMock);

    trash.delete(API_TOKEN);

    assert.deepStrictEqual(request.delete.mock.calls[0].arguments[0], {
      url: API_TRASH_URL,
      token: API_TOKEN,
      query: { path: undefined }
    });
  });
});

describe('restore', () => {
  test('should call request.put and resolve Promise with data and status', async () => {
    const requestPutMock = createRequestMock();
    mock.method(request, 'put', requestPutMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fphoto-restored.png',
        method: 'GET',
        templated: false
      },
      status: 201
    };
    const restorePromise = trash.restore(API_TOKEN, path, name, overwrite);

    assert.deepStrictEqual(request.put.mock.calls[0].arguments[0], {
      url: API_RESTORE_URL,
      token: API_TOKEN,
      query: { path, name, overwrite }
    });

    requestPutMock._resolve(responseMock);

    const result = await restorePromise;
    assert.equal(result, responseMock);
  });

  test('should keep overwrite disabled by default', () => {
    const requestPutMock = createRequestMock();
    mock.method(request, 'put', requestPutMock);

    trash.restore(API_TOKEN, path);

    assert.deepStrictEqual(request.put.mock.calls[0].arguments[0], {
      url: API_RESTORE_URL,
      token: API_TOKEN,
      query: { path, name: undefined, overwrite: false }
    });
  });
});
