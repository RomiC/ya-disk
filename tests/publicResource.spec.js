jest.mock('../lib/request');

const request = require('../lib/request');
const publicResources = require('../lib/publicResource');

const { API_TOKEN } = require('./constants');
const {
  API_PUBLIC_URL,
  API_PUBLIC_RESOURCES_URL,
  API_PUBLIC_DOWNLOAD_URL,
  API_SAVE_TO_DISK_URL
} = require('../lib/constants');

const public_key = 'https://yadi.sk/d/AaaBbb1122Ccc';
const path = '/foo/photo.png';
const name = 'photo-renamed.png';

const listOptions = {
  limit: 10,
  offset: 2,
  type: 'file',
  preview_size: '120x120'
};

describe('get', () => {
  it('should call request.get and resolve Promise with data', () => {
    const responseMock = {
      data: {
        public_key,
        name: 'photo.png',
        path: '/photo.png',
        type: 'file'
      },
      status: 200
    };
    const getPromise = publicResources.get(API_TOKEN, public_key, { path });

    expect(request.get).toHaveBeenCalledWith({
      url: API_PUBLIC_RESOURCES_URL,
      token: API_TOKEN,
      query: { public_key, path }
    });

    request.get._resolve(responseMock);

    expect(getPromise).resolves.toBe(responseMock.data);
  });

  it('should call request.get with default empty options', () => {
    publicResources.get(API_TOKEN, public_key);

    expect(request.get).toHaveBeenCalledWith({
      url: API_PUBLIC_RESOURCES_URL,
      token: API_TOKEN,
      query: { public_key }
    });
  });
});

describe('download', () => {
  it('should call request.get and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://downloader.dst.yandex.ru/disk/...',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const downloadPromise = publicResources.download(
      API_TOKEN,
      public_key,
      path
    );

    expect(request.get).toHaveBeenCalledWith({
      url: API_PUBLIC_DOWNLOAD_URL,
      token: API_TOKEN,
      query: { public_key, path }
    });

    request.get._resolve(responseMock);

    expect(downloadPromise).resolves.toBe(responseMock.data);
  });

  it('should omit path when not specified', () => {
    publicResources.download(API_TOKEN, public_key);

    expect(request.get).toHaveBeenCalledWith({
      url: API_PUBLIC_DOWNLOAD_URL,
      token: API_TOKEN,
      query: { public_key, path: undefined }
    });
  });
});

describe('saveToDisk', () => {
  it('should call request.post and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FDownloads%2Fphoto.png',
        method: 'GET',
        templated: false
      },
      status: 201
    };
    const savePromise = publicResources.saveToDisk(
      API_TOKEN,
      public_key,
      path,
      name
    );

    expect(request.post).toHaveBeenCalledWith({
      url: API_SAVE_TO_DISK_URL,
      token: API_TOKEN,
      query: { public_key, path, name }
    });

    request.post._resolve(responseMock);

    expect(savePromise).resolves.toBe(responseMock.data);
  });

  it('should omit optional params when not specified', () => {
    publicResources.saveToDisk(API_TOKEN, public_key);

    expect(request.post).toHaveBeenCalledWith({
      url: API_SAVE_TO_DISK_URL,
      token: API_TOKEN,
      query: { public_key, path: undefined, name: undefined }
    });
  });
});

describe('list', () => {
  it('should call request.get and resolve Promise with data', () => {
    const responseMock = {
      data: {
        items: [
          {
            public_key,
            name: 'photo.png',
            path: 'disk:/foo/photo.png',
            type: 'file'
          }
        ],
        limit: 10,
        offset: 2,
        type: 'file'
      },
      status: 200
    };
    const listPromise = publicResources.list(API_TOKEN, listOptions);

    expect(request.get).toHaveBeenCalledWith({
      url: API_PUBLIC_URL,
      token: API_TOKEN,
      query: listOptions
    });

    request.get._resolve(responseMock);

    expect(listPromise).resolves.toBe(responseMock.data);
  });
});
