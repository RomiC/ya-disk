import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import publicResources from '../lib/publicResource.js';

import {
  API_PUBLIC_URL,
  API_PUBLIC_RESOURCES_URL,
  API_PUBLIC_DOWNLOAD_URL,
  API_SAVE_TO_DISK_URL
} from '../lib/constants.js';
import { API_TOKEN } from './constants.js';

const publicKey = 'https://yadi.sk/d/AaaBbb1122Ccc';
const path = '/foo/photo.png';
const name = 'photo-renamed.png';

const listOptions = {
  limit: 10,
  offset: 2,
  type: 'file',
  preview_size: '120x120'
};

describe('publicResource', () => {
  afterEach(() => mock.restoreAll());

  describe('get', () => {
    it('should call request.get and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          public_key: publicKey,
          name: 'photo.png',
          path: '/photo.png',
          type: 'file'
        },
        status: 200
      };

      const getMock = mock.method(request, 'request', async () => responseMock);
      const result = await publicResources.get(API_TOKEN, publicKey, { path });

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_PUBLIC_RESOURCES_URL,
        token: API_TOKEN,
        query: { public_key: publicKey, path }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });

    it('should call request.get with default empty options', async () => {
      const getMock = mock.method(request, 'request', async () => ({
        data: null
      }));
      await publicResources.get(API_TOKEN, publicKey);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_PUBLIC_RESOURCES_URL,
        token: API_TOKEN,
        query: { public_key: publicKey }
      });
    });
  });

  describe('download', () => {
    it('should call request.get and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://downloader.dst.yandex.ru/disk/...',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const getMock = mock.method(request, 'request', async () => responseMock);
      const result = await publicResources.download(API_TOKEN, publicKey, path);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_PUBLIC_DOWNLOAD_URL,
        token: API_TOKEN,
        query: { public_key: publicKey, path }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });

    it('should omit path when not specified', async () => {
      const getMock = mock.method(request, 'request', async () => ({
        data: null
      }));
      await publicResources.download(API_TOKEN, publicKey);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_PUBLIC_DOWNLOAD_URL,
        token: API_TOKEN,
        query: { public_key: publicKey, path: undefined }
      });
    });
  });

  describe('saveToDisk', () => {
    it('should call request.post and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FDownloads%2Fphoto.png',
          method: 'GET',
          templated: false
        },
        status: 201
      };

      const postMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await publicResources.saveToDisk(
        API_TOKEN,
        publicKey,
        path,
        name
      );

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
        url: API_SAVE_TO_DISK_URL,
        token: API_TOKEN,
        query: { public_key: publicKey, path, name }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });

    it('should omit optional params when not specified', async () => {
      const postMock = mock.method(request, 'request', async () => ({
        data: null
      }));
      await publicResources.saveToDisk(API_TOKEN, publicKey);

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
        url: API_SAVE_TO_DISK_URL,
        token: API_TOKEN,
        query: { public_key: publicKey, path: undefined, name: undefined }
      });
    });
  });

  describe('list', () => {
    it('should call request.get and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          items: [
            {
              public_key: publicKey,
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

      const getMock = mock.method(request, 'request', async () => responseMock);
      const result = await publicResources.list(API_TOKEN, listOptions);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_PUBLIC_URL,
        token: API_TOKEN,
        query: listOptions
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });
});
