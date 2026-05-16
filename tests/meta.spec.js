import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import meta from '../lib/meta.js';

import { API_TOKEN } from './constants.js';
import { API_RESOURCES_URL } from '../lib/constants.js';

const path = 'disk:/file1.txt';
const options = {
  sort: 'created',
  limit: 13,
  offset: 9,
  preview_size: 'x120',
  preview_crop: true
};
const customProperties = {
  uno: 'value1',
  duos: {
    tres: 'tres',
    cuatro: 'cuatro'
  }
};

describe('meta', () => {
  afterEach(() => mock.restoreAll());

  describe('get', () => {
    it('should call request.get method with correct params and resolve Promise with data', async () => {
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

      const getMock = mock.method(request, 'request', async () => responseMock);
      const result = await meta.get(API_TOKEN, path, options);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: { path, ...options }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });

    it('should append empty object when options is missing', async () => {
      const getMock = mock.method(request, 'request', async () => ({
        data: null
      }));
      await meta.get(API_TOKEN, path);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: { path }
      });
    });
  });

  describe('add', () => {
    it('should call request.patch with proper params and resolve Promise with data', async () => {
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

      const patchMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await meta.add(API_TOKEN, path, customProperties);

      assert.deepStrictEqual(patchMock.mock.calls[0].arguments[0], {
        method: 'PATCH',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: { path },
        data: { custom_properties: customProperties }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });
});
