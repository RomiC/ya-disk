jest.mock('../lib/request');

const request = require('../lib/request');
const trash = require('../lib/trash');

const { API_TOKEN } = require('./constants');
const { API_TRASH_URL, API_RESTORE_URL } = require('../lib/constants');

const path = '/foo/photo.png';
const name = 'photo-restored.png';
const overwrite = true;

describe('delete', () => {
  it('should call request.delete with path and resolve Promise with data and status', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
        method: 'GET',
        templated: false
      },
      status: 202
    };
    const deletePromise = trash.delete(API_TOKEN, path);

    expect(request.delete).toHaveBeenCalledWith({
      url: API_TRASH_URL,
      token: API_TOKEN,
      query: { path }
    });

    request.delete._resolve(responseMock);

    expect(deletePromise).resolves.toBe(responseMock);
  });

  it('should call request.delete without path to clear whole trash', () => {
    trash.delete(API_TOKEN);

    expect(request.delete).toHaveBeenCalledWith({
      url: API_TRASH_URL,
      token: API_TOKEN,
      query: { path: undefined }
    });
  });
});

describe('restore', () => {
  it('should call request.put and resolve Promise with data and status', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fphoto-restored.png',
        method: 'GET',
        templated: false
      },
      status: 201
    };
    const restorePromise = trash.restore(API_TOKEN, path, name, overwrite);

    expect(request.put).toHaveBeenCalledWith({
      url: API_RESTORE_URL,
      token: API_TOKEN,
      query: { path, name, overwrite }
    });

    request.put._resolve(responseMock);

    expect(restorePromise).resolves.toBe(responseMock);
  });

  it('should keep overwrite disabled by default', () => {
    trash.restore(API_TOKEN, path);

    expect(request.put).toHaveBeenCalledWith({
      url: API_RESTORE_URL,
      token: API_TOKEN,
      query: { path, name: undefined, overwrite: false }
    });
  });
});
