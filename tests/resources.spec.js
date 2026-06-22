const assert = require('node:assert/strict');
const { afterEach, describe, mock, test } = require('node:test');

const request = require('../lib/request');
const {
  create,
  remove,
  copy,
  move,
  publish,
  unpublish
} = require('../lib/resources');

const { API_TOKEN } = require('./constants');
const {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL,
  API_PUBLISH_URL,
  API_UNPUBLISH_URL
} = require('../lib/constants');

const { createRequestMock } = require('./test-helper');

const folderName = 'disk:/folderName';
const folder2Name = 'disk:/folder2Name';
const overwrite = true;
const fields = 'field1,field2';
const permanently = true;

afterEach(() => mock.restoreAll());

describe('copy', () => {
  test('should call request.post and resolve Promise with data and status', async () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

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

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
      url: API_COPY_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    });

    requestPostMock._resolve(responseMock);

    const result = await copyPromise;
    assert.equal(result, responseMock);
  });

  test("shouldn't overwrite uploaded file and should returns all fields by default", () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

    copy(API_TOKEN, folderName, folder2Name);

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
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
  test('should call request.put-method and resolve Promise with data', async () => {
    const requestPutMock = createRequestMock();
    mock.method(request, 'put', requestPutMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FMusic',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const createPromise = create(API_TOKEN, folderName);

    assert.deepStrictEqual(request.put.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    });

    requestPutMock._resolve(responseMock);

    const result = await createPromise;
    assert.equal(result, responseMock.data);
  });
});

describe('move', () => {
  test('should call request.post and resolve Promise with data and status', async () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

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

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
      url: API_MOVE_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    });

    requestPostMock._resolve(responseMock);

    const result = await movePromise;
    assert.equal(result, responseMock);
  });

  test("shouldn't overwrite the target file and should return all fields in response by default", () => {
    const requestPostMock = createRequestMock();
    mock.method(request, 'post', requestPostMock);

    move(API_TOKEN, folderName, folder2Name);

    assert.deepStrictEqual(request.post.mock.calls[0].arguments[0], {
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
  test('should call request.delete-method and resolve promise with data and status', async () => {
    const requestDeleteMock = createRequestMock();
    mock.method(request, 'delete', requestDeleteMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/operations?id=d80c269ce4eb16c0207f0a15t4a31415313452f9e950cd9576f36b1146ee0e42',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const removePromise = remove(API_TOKEN, folderName, permanently);

    assert.deepStrictEqual(request.delete.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName,
        permanently
      }
    });

    requestDeleteMock._resolve(responseMock);

    const result = await removePromise;
    assert.equal(result, responseMock);
  });

  test("shouldn't remove permanently by default", () => {
    const requestDeleteMock = createRequestMock();
    mock.method(request, 'delete', requestDeleteMock);

    remove(API_TOKEN, folderName);

    assert.deepStrictEqual(request.delete.mock.calls[0].arguments[0], {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: { path: folderName, permanently: false }
    });
  });
});

describe('publish', () => {
  test('should call request.put and resolve Promise with data', async () => {
    const requestPutMock = createRequestMock();
    mock.method(request, 'put', requestPutMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const publishPromise = publish(API_TOKEN, folderName);

    assert.deepStrictEqual(request.put.mock.calls[0].arguments[0], {
      url: API_PUBLISH_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    });

    requestPutMock._resolve(responseMock);

    const result = await publishPromise;
    assert.equal(result, responseMock.data);
  });
});

describe('unpublish', () => {
  test('should call request.put and resolve Promise with data', async () => {
    const requestPutMock = createRequestMock();
    mock.method(request, 'put', requestPutMock);

    const responseMock = {
      data: {
        href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
        method: 'GET',
        templated: false
      },
      status: 200
    };
    const unpublishPromise = unpublish(API_TOKEN, folderName);

    assert.deepStrictEqual(request.put.mock.calls[0].arguments[0], {
      url: API_UNPUBLISH_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    });

    requestPutMock._resolve(responseMock);

    const result = await unpublishPromise;
    assert.equal(result, responseMock.data);
  });
});
