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
    cuatro: 'cuatro'
  }
};

jest.mock('../lib/request');

describe('get', () => {
  it('should call request.get method with correct params and resolve Promise with data', () => {
    const responseMock = {
      data: {
        name: 'photo2.png',
        preview: 'https://downloader.disk.yandex.ru/preview/...',
        created: '2014-04-22T14:57:13+04:00',
        modified: '2014-04-22T14:57:14+04:00',
        path: 'disk:/foo/photo2.png',
        md5: '53f4dc6379c8f95ddf11b9508cfea271',
        type: 'file',
        mime_type: 'image/png',
        size: 54321
      },
      status: 200
    };
    const metaGetPromise = meta.get(API_TOKEN, path, options);

    expect(request.get).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path, ...options }
    });

    request.get._resolve(responseMock);

    expect(metaGetPromise).resolves.toBe(responseMock.data);
  });

  it('should append empty object when options is mised', () => {
    meta.get(API_TOKEN, path);

    expect(request.get).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path }
    });
  });
});

describe('add', () => {
  it('should call request.patch with proper params and resolve Promise with data', () => {
    const responseMock = {
      data: {
        name: 'photo2.png',
        preview: 'https://downloader.disk.yandex.ru/preview/...',
        created: '2014-04-22T14:57:13+04:00',
        modified: '2014-04-22T14:57:14+04:00',
        path: 'disk:/foo/photo2.png',
        md5: '53f4dc6379c8f95ddf11b9508cfea271',
        type: 'file',
        mime_type: 'image/png',
        size: 54321
      },
      status: 200
    };

    const metaAddPromise = meta.add(API_TOKEN, path, custom_properties);

    expect(request.patch).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path },
      data: { custom_properties }
    });

    request.patch._resolve(responseMock);

    expect(metaAddPromise).resolves.toBe(responseMock.data);
  });
});
