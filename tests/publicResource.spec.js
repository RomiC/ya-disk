const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const publicResources = require('../lib/publicResource');

const { API_TOKEN } = require('./constants');
const {
  API_PUBLIC_URL,
  API_PUBLIC_RESOURCES_URL,
  API_PUBLIC_DOWNLOAD_URL,
  API_SAVE_TO_DISK_URL
} = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const public_key = 'https://yadi.sk/d/AaaBbb1122Ccc';
const path = '/foo/photo.png';
const name = 'photo-renamed.png';

const listOptions = {
  limit: 10,
  offset: 2,
  type: 'file',
  preview_size: '120x120'
};

afterEach(() => mock.restoreAll());

describe('get', () => {
  test('should call request.get and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        public_key,
        name: 'photo.png',
        path: '/photo.png',
        type: 'file'
      },
      status: 200
    };
    const getPromise = publicResources.get(API_TOKEN, public_key, { path });

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_PUBLIC_RESOURCES_URL,
      token: API_TOKEN,
      query: { public_key, path }
    });

    requestGetMock._resolve(responseMock);

    const result = await getPromise;
    assert.equal(result, responseMock.data);
  });

  test('should call request.get with default empty options', () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    publicResources.get(API_TOKEN, public_key);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_PUBLIC_RESOURCES_URL,
      token: API_TOKEN,
      query: { public_key }
    });
  });
});

describe('download', () => {
  test('should call request.get and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        href: 'https://downloader.dst.yandex.ru/disk/...',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const downloadPromise = publicResources.download(
      API_TOKEN,
      public_key,
      path
    );

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_PUBLIC_DOWNLOAD_URL,
      token: API_TOKEN,
      query: { public_key, path }
    });

    requestGetMock._resolve(responseMock);

    const result = await downloadPromise;
    assert.equal(result, responseMock.data);
  });

  test('should omit path when not specified', () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    publicResources.download(API_TOKEN, public_key);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_PUBLIC_DOWNLOAD_URL,
      token: API_TOKEN,
      query: { public_key, path: undefined }
    });
  });
});

describe('saveToDisk', () => {
  test('should call request.post and resolve Promise with data', async () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FDownloads%2Fphoto.png',
        method: 'GET',
        templated: false
      },
      status: 201
    };
    const savePromise = publicResources.saveToDisk(
      API_TOKEN,
      public_key,
      path,
      name
    );

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
      url: API_SAVE_TO_DISK_URL,
      token: API_TOKEN,
      query: { public_key, path, name }
    });

    requestPostMock._resolve(responseMock);

    const result = await savePromise;
    assert.equal(result, responseMock.data);
  });

  test('should omit optional params when not specified', () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

    publicResources.saveToDisk(API_TOKEN, public_key);

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
      url: API_SAVE_TO_DISK_URL,
      token: API_TOKEN,
      query: { public_key, path: undefined, name: undefined }
    });
  });
});

describe('list', () => {
  test('should call request.get and resolve Promise with data', async () => {
    const requestGetMock = createRequestMock();
    mock.method(request, 'get', requestGetMock);

    const responseMock = {
      data: {
        items: [
          {
            public_key,
            name: 'photo.png',
            path: 'disk:/foo/photo.png',
            type: 'file'
          }
        ],
        limit: 10,
        offset: 2,
        type: 'file'
      },
      status: 200
    };
    const listPromise = publicResources.list(API_TOKEN, listOptions);

    assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
      url: API_PUBLIC_URL,
      token: API_TOKEN,
      query: listOptions
    });

    requestGetMock._resolve(responseMock);

    const result = await listPromise;
    assert.equal(result, responseMock.data);
  });
});
