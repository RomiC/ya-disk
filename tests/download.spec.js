import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import { link } from '../lib/download.js';

import { API_TOKEN } from './constants.js';
import { API_DOWNLOAD_LINK_URL } from '../lib/constants.js';

const path = 'disk:/file.txt';

describe('download', () => {
  afterEach(() => mock.restoreAll());

  describe('link', () => {
    it('should call request.get method with correct params and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://yandex.ru/disk/download/file.txt',
          method: 'GET',
          templated: false
        },
        status: 200
      };
      const getMock = mock.method(request, 'request', async () => responseMock);

      const result = await link(API_TOKEN, path);

      assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
        method: 'GET',
        url: API_DOWNLOAD_LINK_URL,
        token: API_TOKEN,
        query: { path }
      });

      assert.deepStrictEqual(result, responseMock.data);
    });
  });
});
