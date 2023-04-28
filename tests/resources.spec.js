const request = require('../lib/request');
const { create, remove, copy, move } = require('../lib/resources');

const { API_TOKEN } = require('./constants');
const {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL
} = require('../lib/constants');

const folderName = 'disk:/folderName';
const folder2Name = 'disk:/folder2Name';
const overwrite = true;
const fields = 'field1,field2';
const permanently = true;

jest.mock('../lib/request');

describe('copy', () => {
  it('should call request.post and resolve Promise with data and status', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const copyPromise = copy(
      API_TOKEN,
      folderName,
      folder2Name,
      overwrite,
      fields
    );

    expect(request.post).toHaveBeenCalledWith({
      url: API_COPY_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    });

    request.post._resolve(responseMock);

    expect(copyPromise).resolves.toBe(responseMock);
  });

  it("shouldn't overwrite uploaded file and should returns all fields by default", () => {
    copy(API_TOKEN, folderName, folder2Name);

    expect(request.post).toHaveBeenCalledWith({
      url: API_COPY_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite: false,
        fields: ''
      }
    });
  });
});

describe('create', () => {
  it('should call request.put-method and resolve Promise with data', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FMusic',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const createPromise = create(API_TOKEN, folderName);

    expect(request.put).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    });

    request.put._resolve(responseMock);

    expect(createPromise).resolves.toBe(responseMock.data);
  });
});

describe('move', () => {
  it('should call request.post and resolve Promise with data and status', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Fbar%2Fphoto.png',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const movePromise = move(
      API_TOKEN,
      folderName,
      folder2Name,
      overwrite,
      fields
    );

    expect(request.post).toHaveBeenCalledWith({
      url: API_MOVE_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    });

    request.post._resolve(responseMock);

    expect(movePromise).resolves.toBe(responseMock);
  });

  it("shouldn't overwrite the target file and should return all fields in response by default", () => {
    move(API_TOKEN, folderName, folder2Name);

    expect(request.post).toHaveBeenCalledWith({
      url: API_MOVE_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite: false,
        fields: ''
      }
    });
  });
});

describe('remove', () => {
  it('should call request.deleted-method and resolve promise with data and status', () => {
    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=d80c269ce4eb16c0207f0a15t4a31415313452f9e950cd9576f36b1146ee0e42',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const removePromise = remove(API_TOKEN, folderName, permanently);

    expect(request.delete).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName,
        permanently
      }
    });

    request.delete._resolve(responseMock);

    expect(removePromise).resolves.toBe(responseMock);
  });

  it("shouldn't remove permanently by default", () => {
    remove(API_TOKEN, folderName);

    expect(request.delete).toHaveBeenCalledWith({
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path: folderName, permanently: false }
    });
  });
});
