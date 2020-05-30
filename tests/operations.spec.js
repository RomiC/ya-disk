const request = require('../lib/request');
const operations = require('../lib/operations');

const { API_TOKEN } = require('./constants');
const { API_OPERATIONS_URL } = require('../lib/constants');

const id = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

jest.mock('../lib/request');

test('should call request.get with proper params and resolve Promise with data', () => {
  const responseMock = {
    data: {
      status: 'failed'
    },
    status: 200
  };

  const operationPromise = operations(API_TOKEN, id);

  expect(request.get).toHaveBeenCalledWith({
    url: `${API_OPERATIONS_URL}/${id}`,
    token: API_TOKEN
  });

  request.get._resolve(responseMock);

  expect(operationPromise).resolves.toBe(responseMock.data);
});
