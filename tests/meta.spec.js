const request = require('../lib/request');
const meta = require('../lib/meta');

const { API_TOKEN } = require('./constants');
const { API_RESOURCES_URL } = require('../lib/constants');

const path = `disk:/file1.txt`;
const options = {
  sort: 'created',
  limit: 13,
  offset: 9,
  preview_size: 'x120',
  preview_crop: true
};
const custom_properties = {
  uno: 'value1',
  duos: {
    tres: 'tres',
    quatros: 'quatros'
  }
};
const onSuccessCallback = jest.fn();
const onErrorCallback = jest.fn();

jest.mock('../lib/request');

test('get', () => {
  meta.get(API_TOKEN, path, options, onSuccessCallback, onErrorCallback);

  expect(request.get).toHaveBeenCalledWith(
    {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: Object.assign({ path }, options)
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('add', () => {
  meta.add(
    API_TOKEN,
    path,
    custom_properties,
    onSuccessCallback,
    onErrorCallback
  );

  expect(request.patch).toHaveBeenCalledWith(
    {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path },
      data: { custom_properties }
    },
    onSuccessCallback,
    onErrorCallback
  );
});
