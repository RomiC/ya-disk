const request = require('../lib/request');
const { link } = require('../lib/download');

const { API_TOKEN } = require('./constants');
const { API_DOWNLOAD_LINK_URL } = require('../lib/constants');

const path = 'disk:/file.txt';

jest.mock('../lib/request');

describe('link', () => {
  it('should call request.get method with correct params and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://yandex.ru/disk/download/file.txt',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const linkPromise = link(API_TOKEN, path);

    expect(request.get).toHaveBeenCalledWith({
      url: API_DOWNLOAD_LINK_URL,
      token: API_TOKEN,
      query: { path }
    });

    request.get._resolve(responseMock);

    expect(linkPromise).resolves.toBe(responseMock.data);
  });
});
