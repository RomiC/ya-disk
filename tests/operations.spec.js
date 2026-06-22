const assert = require('node:assert/strict');
const { afterEach, mock, test } = require('node:test');

const request = require('../lib/request');
const operations = require('../lib/operations');

const { API_TOKEN } = require('./constants');
const { API_OPERATIONS_URL } = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const id = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

afterEach(() => mock.restoreAll());

test('should call request.get with proper params and resolve Promise with data', async () => {
  const requestGetMock = createRequestMock();
  mock.method(request, 'get', requestGetMock);

  const responseMock = {
    data: {
      status: 'failed'
    },
    status: 200
  };

  const operationPromise = operations(API_TOKEN, id);

  assert.deepStrictEqual(request.get.mock.calls[0].arguments[0], {
    url: `${API_OPERATIONS_URL}/${id}`,
    token: API_TOKEN
  });

  requestGetMock._resolve(responseMock);

  const result = await operationPromise;
  assert.equal(result, responseMock.data);
});
