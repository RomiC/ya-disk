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

const onSuccessCallback = jest.fn();
const onErrorCallback = jest.fn();

jest.mock('../lib/request');

describe('get', () => {
  it('should call request.get with options', () => {
    publicResources.get(
      API_TOKEN,
      public_key,
      { path },
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.get).toHaveBeenCalledWith(
      {
        url: API_PUBLIC_RESOURCES_URL,
        token: API_TOKEN,
        query: { public_key, path }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });

  it('should call request.get with default options', () => {
    publicResources.get(API_TOKEN, public_key, undefined, onSuccessCallback);

    expect(request.get).toHaveBeenCalledWith(
      {
        url: API_PUBLIC_RESOURCES_URL,
        token: API_TOKEN,
        query: { public_key }
      },
      onSuccessCallback,
      undefined
    );
  });
});

describe('download', () => {
  it('should call request.get with proper params', () => {
    publicResources.download(
      API_TOKEN,
      public_key,
      path,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.get).toHaveBeenCalledWith(
      {
        url: API_PUBLIC_DOWNLOAD_URL,
        token: API_TOKEN,
        query: { public_key, path }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });

  it('should allow omitted path', () => {
    publicResources.download(
      API_TOKEN,
      public_key,
      undefined,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.get).toHaveBeenCalledWith(
      {
        url: API_PUBLIC_DOWNLOAD_URL,
        token: API_TOKEN,
        query: { public_key, path: undefined }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });
});

describe('saveToDisk', () => {
  it('should call request.post with proper params', () => {
    publicResources.saveToDisk(
      API_TOKEN,
      public_key,
      path,
      name,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.post).toHaveBeenCalledWith(
      {
        url: API_SAVE_TO_DISK_URL,
        token: API_TOKEN,
        query: { public_key, path, name }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });

  it('should allow omitted optional params', () => {
    publicResources.saveToDisk(
      API_TOKEN,
      public_key,
      undefined,
      undefined,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.post).toHaveBeenCalledWith(
      {
        url: API_SAVE_TO_DISK_URL,
        token: API_TOKEN,
        query: { public_key, path: undefined, name: undefined }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });
});

describe('list', () => {
  it('should call request.get with proper params', () => {
    publicResources.list(
      API_TOKEN,
      listOptions,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.get).toHaveBeenCalledWith(
      {
        url: API_PUBLIC_URL,
        token: API_TOKEN,
        query: listOptions
      },
      onSuccessCallback,
      onErrorCallback
    );
  });
});
