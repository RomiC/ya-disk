const request = require('../lib/request');
const { link, remoteFile } = require('../lib/upload');

const { API_TOKEN } = require('./constants');
const { API_UPLOAD_LINK_URL } = require('../lib/constants');

const path = 'disk:/file.txt';
const overwrite = true;
const url = 'https://example.com/file.txt';

jest.mock('../lib/request');

describe('link', () => {
  it('should call request.get with proper params and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://uploader1d.dst.yandex.net:443/upload-target/',
        method: 'PUT',
        templated: false
      },
      status: 200
    };
    const linkPromise = link(API_TOKEN, path, overwrite);

    expect(request.get).toHaveBeenCalledWith({
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        path,
        overwrite
      }
    });

    request.get._resolve(responseMock);

    expect(linkPromise).resolves.toBe(responseMock.data);
  });

  it("shouldn't overwrite currently existed resource by default", () => {
    link(API_TOKEN, path);

    expect(request.get).toHaveBeenCalledWith({
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: { path, overwrite: false }
    });
  });
});

describe('remoteFile', () => {
  it('should call request.post with proper params and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=33ca7d03ab21ct41b4a40182e78d828a3f8b72cdb5f4c0e94cc4b1449a63a2fe',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const remoteFilePromise = remoteFile(API_TOKEN, url, path);

    expect(request.post).toHaveBeenCalledWith({
      url: API_UPLOAD_LINK_URL,
      token: API_TOKEN,
      query: {
        url,
        path
      }
    });

    request.post._resolve(responseMock);

    expect(remoteFilePromise).resolves.toBe(responseMock.data);
  });
});
