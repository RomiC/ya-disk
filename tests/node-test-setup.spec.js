jest.mock('../lib/request');
jest.mock('https');

const request = require('../lib/request');
const https = require('https');

test('should resolve relative manual mocks through jest.mock', () => {
  request.get({ url: 'https://example.com' });

  expect(request.get).toHaveBeenCalledWith({ url: 'https://example.com' });
});

test('should resolve core module manual mocks through jest.mock', () => {
  const response = https.request({}, () => {});

  expect(https.request).toHaveBeenCalledWith({}, expect.any(Function));
  expect(response).toBe(https.request._serverResponse);
});

test('should clear mock calls between tests', () => {
  expect(request.get).not.toHaveBeenCalled();
});
