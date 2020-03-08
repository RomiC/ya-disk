const request = require('../lib/request');
const operations = require('../lib/operations');

const { API_TOKEN } = require('./constants');
const { API_OPERATIONS_URL } = require('../lib/constants');

const id = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

jest.mock('../lib/request');

test('status', () => {
  const onSuccessCallback = jest.fn();
  const onErrorCallback = jest.fn();

  operations(API_TOKEN, id, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: `${API_OPERATIONS_URL}/${id}`,
      token: API_TOKEN
    },
    onSuccessCallback,
    onErrorCallback
  );
});
