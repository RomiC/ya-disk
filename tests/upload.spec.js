import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import { link, remoteFile } from '../lib/upload.js';

import { API_TOKEN } from './constants.js';
import { API_UPLOAD_LINK_URL } from '../lib/constants.js';

const path = 'disk:/file.txt';
const overwrite = true;
const url = 'https://example.com/file.txt';

describe('upload', () => {
  afterEach(() => mock.restoreAll());

  describe('link', () => {
    it('should call request.get with proper params and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://uploader1d.dst.yandex.net:443/upload-target/',
          method: 'PUT',
          templated: false
        },
        status: 200
      };

      const getMock = mock.method(request, 'request', async () => responseMock);
      const result = await link(API_TOKEN, path, overwrite);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_UPLOAD_LINK_URL,
        token: API_TOKEN,
        query: { path, overwrite }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });

    it("shouldn't overwrite currently existed resource by default", async () => {
      const getMock = mock.method(request, 'request', async () => ({
        data: null
      }));
      await link(API_TOKEN, path);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_UPLOAD_LINK_URL,
        token: API_TOKEN,
        query: { path, overwrite: false }
      });
    });
  });

  describe('remoteFile', () => {
    it('should call request.post with proper params and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const postMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await remoteFile(API_TOKEN, url, path);

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
        url: API_UPLOAD_LINK_URL,
        token: API_TOKEN,
        query: { url, path }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });
});
