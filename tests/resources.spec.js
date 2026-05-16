import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { requestApi as request } from '../lib/request.js';
import {
  create,
  remove,
  copy,
  move,
  publish,
  unpublish
} from '../lib/resources.js';

import { API_TOKEN } from './constants.js';
import {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL,
  API_PUBLISH_URL,
  API_UNPUBLISH_URL
} from '../lib/constants.js';

const folderName = 'disk:/folderName';
const folder2Name = 'disk:/folder2Name';
const overwrite = true;
const fields = 'field1,field2';
const permanently = true;

describe('resources', () => {
  afterEach(() => mock.restoreAll());

  describe('copy', () => {
    it('should call request.post and resolve Promise with data and status', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const postMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await copy(
        API_TOKEN,
        folderName,
        folder2Name,
        overwrite,
        fields
      );

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
        url: API_COPY_URL,
        token: API_TOKEN,
        query: {
          from: folderName,
          path: folder2Name,
          overwrite,
          fields
        }
      });
      assert.deepStrictEqual(result, responseMock);
    });

    it("shouldn't overwrite uploaded file and should returns all fields by default", async () => {
      const postMock = mock.method(request, 'request', async () => ({
        data: null,
        status: 200
      }));
      await copy(API_TOKEN, folderName, folder2Name);

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
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
    it('should call request.put-method and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2FMusic',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const putMock = mock.method(request, 'request', async () => responseMock);
      const result = await create(API_TOKEN, folderName);

      assert.deepStrictEqual(putMock.mock.calls[0].arguments[0], {
        method: 'PUT',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: {
          path: folderName
        }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });

  describe('move', () => {
    it('should call request.post and resolve Promise with data and status', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Fbar%2Fphoto.png',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const postMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await move(
        API_TOKEN,
        folderName,
        folder2Name,
        overwrite,
        fields
      );

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
        url: API_MOVE_URL,
        token: API_TOKEN,
        query: {
          from: folderName,
          path: folder2Name,
          overwrite,
          fields
        }
      });
      assert.deepStrictEqual(result, responseMock);
    });

    it("shouldn't overwrite the target file and should return all fields in response by default", async () => {
      const postMock = mock.method(request, 'request', async () => ({
        data: null,
        status: 200
      }));
      await move(API_TOKEN, folderName, folder2Name);

      assert.deepStrictEqual(postMock.mock.calls[0].arguments[0], {
        method: 'POST',
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
    it('should call request.deleted-method and resolve promise with data and status', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/operations?id=d80c269ce4eb16c0207f0a15t4a31415313452f9e950cd9576f36b1146ee0e42',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const deleteMock = mock.method(
        request,
        'request',
        async () => responseMock
      );
      const result = await remove(API_TOKEN, folderName, permanently);

      assert.deepStrictEqual(deleteMock.mock.calls[0].arguments[0], {
        method: 'DELETE',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: {
          path: folderName,
          permanently
        }
      });
      assert.deepStrictEqual(result, responseMock);
    });

    it("shouldn't remove permanently by default", async () => {
      const deleteMock = mock.method(request, 'request', async () => ({
        data: null,
        status: 200
      }));
      await remove(API_TOKEN, folderName);

      assert.deepStrictEqual(deleteMock.mock.calls[0].arguments[0], {
        method: 'DELETE',
        url: API_RESOURCES_URL,
        token: API_TOKEN,
        query: { path: folderName, permanently: false }
      });
    });
  });

  describe('publish', () => {
    it('should call request.put and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const putMock = mock.method(request, 'request', async () => responseMock);
      const result = await publish(API_TOKEN, folderName);

      assert.deepStrictEqual(putMock.mock.calls[0].arguments[0], {
        method: 'PUT',
        url: API_PUBLISH_URL,
        token: API_TOKEN,
        query: {
          path: folderName
        }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });

  describe('unpublish', () => {
    it('should call request.put and resolve Promise with data', async () => {
      const responseMock = {
        data: {
          href: 'https://cloud-api.yandex.net/v1/disk/resources?path=disk%3A%2Ffoo%2Fbar',
          method: 'GET',
          templated: false
        },
        status: 200
      };

      const putMock = mock.method(request, 'request', async () => responseMock);
      const result = await unpublish(API_TOKEN, folderName);

      assert.deepStrictEqual(putMock.mock.calls[0].arguments[0], {
        method: 'PUT',
        url: API_UNPUBLISH_URL,
        token: API_TOKEN,
        query: {
          path: folderName
        }
      });
      assert.deepStrictEqual(result, responseMock.data);
    });
  });
});
