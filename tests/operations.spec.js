import assert from 'node:assert/strict';
import { afterEach, describe, mock, test } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import operations from '../lib/operations.js';

import { API_TOKEN } from './constants.js';
import { API_OPERATIONS_URL } from '../lib/constants.js';

describe('operations', () => {
  afterEach(() => mock.restoreAll());

  const id = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

  test('should call request.get with proper params and resolve Promise with data', async () => {
    const responseMock = {
      data: {
        status: 'failed'
      },
      status: 200
    };

    const getMock = mock.method(request, 'request', async () => responseMock);
    const result = await operations(API_TOKEN, id);

    assert.deepStrictEqual(getMock.mock.calls[0].arguments[0], {
      method: 'GET',
      url: `${API_OPERATIONS_URL}/${id}`,
      token: API_TOKEN
    });

    assert.deepStrictEqual(result, responseMock.data);
  });
});
