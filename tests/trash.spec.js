import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import trash from '../lib/trash.js';

import { API_TOKEN } from './constants.js';
import { API_TRASH_URL, API_RESTORE_URL } from '../lib/constants.js';

const path = '/foo/photo.png';
const name = 'photo-restored.png';
const overwrite = true;

describe('trash', () => {
  afterEach(() => mock.restoreAll());

  describe('delete', () => {
    it('should call request.delete with path and resolve Promise with data and status', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
          method: 'GET',
          templated: false
        },
        status: 202
      };

      const deleteMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await trash.delete(API_TOKEN, path);

      assert.deepStrictEqual(deleteMock.mock.calls[0].arguments[0], {
        method: 'DELETE',
        url: API_TRASH_URL,
        token: API_TOKEN,
        query: { path }
      });
      assert.deepStrictEqual(result, responseMock);
    });

    it('should call request.delete without path to clear whole trash', async () => {
      const deleteMock = mock.method(request, 'request', async () => ({
        data: null,
        status: 200
      }));
      await trash.delete(API_TOKEN);

      assert.deepStrictEqual(deleteMock.mock.calls[0].arguments[0], {
        method: 'DELETE',
        url: API_TRASH_URL,
        token: API_TOKEN,
        query: { path: undefined }
      });
    });
  });

  describe('restore', () => {
    it('should call request.put and resolve Promise with data and status', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fphoto-restored.png',
          method: 'GET',
          templated: false
        },
        status: 201
      };

      const putMock = mock.method(request, 'request', async () => responseMock);
      const result = await trash.restore(API_TOKEN, path, name, overwrite);

      assert.deepStrictEqual(putMock.mock.calls[0].arguments[0], {
        method: 'PUT',
        url: API_RESTORE_URL,
        token: API_TOKEN,
        query: { path, name, overwrite }
      });
      assert.deepStrictEqual(result, responseMock);
    });

    it('should keep overwrite disabled by default', async () => {
      const putMock = mock.method(request, 'request', async () => ({
        data: null,
        status: 200
      }));
      await trash.restore(API_TOKEN, path);

      assert.deepStrictEqual(putMock.mock.calls[0].arguments[0], {
        method: 'PUT',
        url: API_RESTORE_URL,
        token: API_TOKEN,
        query: { path, name: undefined, overwrite: false }
      });
    });
  });
});
