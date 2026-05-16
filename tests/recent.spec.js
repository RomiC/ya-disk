import assert from 'node:assert/strict';
import { afterEach, describe, mock, test } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import recent from '../lib/recent.js';

import { API_TOKEN } from './constants.js';
import { API_RECENT_FILES_URL } from '../lib/constants.js';

describe('recent', () => {
  afterEach(() => mock.restoreAll());

  const options = {
    limit: 13,
    media_type: 'backup,book,audio',
    preview_size: '130x',
    preview_crop: false
  };

  test('should call request.get with correct params and resolve Promise with data', async () => {
    const responseMock = {
      data: {
        items: [
          {
            name: 'photo2.png',
            preview: 'https://downloader.disk.yandex.ru/preview/...',
            created: '2014-04-22T14:57:13+04:00',
            modified: '2014-04-22T14:57:14+04:00',
            path: 'disk:/foo/photo2.png',
            md5: '53f4dc6379c8f95ddf11b9508cfea271',
            type: 'file',
            mime_type: 'image/png',
            size: 54321
          }
        ],
        limit: 20
      }
    };
    const getMock = mock.method(request, 'request', async () => responseMock);
    const result = await recent(API_TOKEN, options);

    assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
      method: 'GET',
      url: API_RECENT_FILES_URL,
      token: API_TOKEN,
      query: options
    });

    assert.deepStrictEqual(result, responseMock.data);
  });
});
