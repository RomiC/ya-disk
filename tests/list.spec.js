import assert from 'node:assert/strict';
import { afterEach, describe, mock, test } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import list from '../lib/list.js';

import { API_TOKEN } from './constants.js';
import { API_FILES_URL } from '../lib/constants.js';

describe('list', () => {
  afterEach(() => mock.restoreAll());

  const options = {
    limit: 13,
    media_type: 'diskimage,settings,image',
    offset: 3,
    preview_size: '130x',
    preview_crop: true
  };

  test('should call request.get with proper params and resolve Promise with data', async () => {
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
        limit: 20,
        offset: 0
      }
    };
    const getMock = mock.method(request, 'request', async () => responseMock);
    const result = await list(API_TOKEN, options);

    assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
      method: 'GET',
      url: API_FILES_URL,
      token: API_TOKEN,
      query: options
    });

    assert.deepStrictEqual(result, responseMock.data);
  });
});
