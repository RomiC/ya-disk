const info = require('../lib/info');
const request = require('../lib/request');

const { API_DISK_URL } = require('../lib/constants');
const { API_TOKEN } = require('./constants');

jest.mock('../lib/request');

test('should call request.do with correct params and resolve Promise with data', () => {
  const responseMock = {
    data: {
      total_space: 10 * 1024 * 1024 * 1024,
      trash_size: 2 * 1024 * 1024,
      used_space: 3 * 1024 * 1024 * 1024
    },
    status: 200
  };

  const infoPromise = info(API_TOKEN);

  expect(request.get).toHaveBeenCalledWith({
    url: API_DISK_URL,
    token: API_TOKEN
  });

  request.get._resolve(responseMock);

  expect(infoPromise).resolves.toBe(responseMock.data);
});
