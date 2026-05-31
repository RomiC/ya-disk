import assert from 'node:assert/strict';
import { afterEach, describe, mock, test } from 'node:test';

import info from '../lib/info.js';
import { requestApi as request } from '../lib/request.js';

import { API_DISK_URL } from '../lib/constants.js';
import { API_TOKEN } from './constants.js';

describe('info', () => {
  afterEach(() => mock.restoreAll());

  test('should call request.get with correct params and resolve Promise with data', async () => {
    const responseMock = {
      data: {
        total_space: 10 * 1024 * 1024 * 1024,
        trash_size: 2 * 1024 * 1024,
        used_space: 3 * 1024 * 1024 * 1024
      },
      status: 200
    };

    const getMock = mock.method(request, 'request', async () => responseMock);
    const result = await info(API_TOKEN);

    assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
      method: 'GET',
      url: API_DISK_URL,
      token: API_TOKEN
    });

    assert.deepStrictEqual(result, responseMock.data);
  });
});
