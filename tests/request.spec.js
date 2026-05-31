import assert from 'node:assert/strict';
import https from 'node:https';
import { stringify as queryStringify } from 'node:querystring';
import { Readable, Writable } from 'node:stream';
import { afterEach, describe, mock, test } from 'node:test';

import {
  get,
  post,
  put,
  patch,
  delete as deleteRequest
} from '../lib/request.js';

import { API_TOKEN as token } from './constants.js';

const url = 'https://cloud-api.yandex.net/v1/disk';
const parsedUrl = new URL(url);
const urlOptions = {
  protocol: parsedUrl.protocol,
  hostname: parsedUrl.hostname,
  port: parsedUrl.port || null,
  path: parsedUrl.pathname
};
const method = 'POST';
const query = {
  foo: 'string',
  bar: 3
};
const data = {
  baz: 4,
  zoom: 'zoom'
};
const queryString = queryStringify(query);
const authHeader = `OAuth ${token}`;

class IncomingMessageStub extends Readable {
  constructor(message, statusCode) {
    super();

    this._message = message;
    this.statusCode = statusCode;
  }

  _read() {
    this.push(this._message);
    this.push(null);
  }
}

class ServerResponseStub extends Writable {
  constructor() {
    super();
    this._data = '';
  }

  _write(chunk, _, done) {
    this._data += chunk;
    done();
  }
}

afterEach(() => mock.restoreAll());

describe('request', () => {
  test('should have proper default params and pass them to https.request', () => {
    const requestMock = mock.method(
      https,
      'request',
      () => new ServerResponseStub()
    );

    get({
      url,
      token
    });

    assert.deepStrictEqual(requestMock.mock.calls[0].arguments[0], {
      ...urlOptions,
      method: 'GET',
      headers: { Authorization: authHeader }
    });
    assert.equal(typeof requestMock.mock.calls[0].arguments[1], 'function');
  });

  test('should call https.request with correct params', () => {
    const requestMock = mock.method(
      https,
      'request',
      () => new ServerResponseStub()
    );

    post({
      url,
      token,
      method,
      query
    });

    assert.deepStrictEqual(requestMock.mock.calls[0].arguments[0], {
      ...urlOptions,
      method,
      path: `${urlOptions.path}?${queryString}`,
      headers: {
        Authorization: authHeader
      }
    });
    assert.equal(typeof requestMock.mock.calls[0].arguments[1], 'function');
  });

  test('should strip empty query params before calling https.request', () => {
    const requestMock = mock.method(
      https,
      'request',
      () => new ServerResponseStub()
    );

    post({
      url,
      token,
      method,
      query: {
        foo: 'string',
        bar: 3,
        empty: '',
        missing: undefined,
        nil: null
      }
    });

    assert.deepStrictEqual(requestMock.mock.calls[0].arguments[0], {
      ...urlOptions,
      method,
      path: `${urlOptions.path}?${queryString}`,
      headers: {
        Authorization: authHeader
      }
    });
    assert.equal(typeof requestMock.mock.calls[0].arguments[1], 'function');
  });

  test('should omit query string when all query params are empty', () => {
    const requestMock = mock.method(
      https,
      'request',
      () => new ServerResponseStub()
    );

    post({
      url,
      token,
      query: {
        empty: '',
        missing: undefined,
        nil: null
      }
    });

    assert.deepStrictEqual(requestMock.mock.calls[0].arguments[0], {
      ...urlOptions,
      method,
      path: urlOptions.path,
      headers: {
        Authorization: authHeader
      }
    });
    assert.equal(typeof requestMock.mock.calls[0].arguments[1], 'function');
  });

  test('should resolve Promise with parsed result and status code', async () => {
    const expectedResponse = {
      param1: 4631577437,
      param2: 'disk:/Загрузки/',
      param3: {
        param4: 'disk:/Приложения'
      }
    };

    mock.method(https, 'request', (_, callback) => {
      const req = new ServerResponseStub();
      callback(new IncomingMessageStub(JSON.stringify(expectedResponse), 200));
      return req;
    });

    await assert.doesNotReject(async () => {
      const result = await get({ url, token });
      assert.deepStrictEqual(result, {
        data: expectedResponse,
        status: 200
      });
    });
  });

  test('should resolve with null data and status code when response is empty', async () => {
    mock.method(https, 'request', (_, callback) => {
      const req = new ServerResponseStub();
      callback(new IncomingMessageStub('', 201));
      return req;
    });

    const result = await get({ url, token });
    assert.deepStrictEqual(result, { data: null, status: 201 });
  });

  test(`should reject with Error when response code isn't 2xx`, async () => {
    const expectedResponse = {
      description: 'resource already exists',
      error: 'PlatformResourceAlreadyExists'
    };

    mock.method(https, 'request', (_, callback) => {
      const req = new ServerResponseStub();
      callback(new IncomingMessageStub(JSON.stringify(expectedResponse), 401));
      return req;
    });

    await assert.rejects(
      get({ url, token }),
      (error) =>
        error instanceof Error &&
        error.message === expectedResponse.description &&
        error.name === expectedResponse.error
    );
  });

  test('should reject when https.request emits error', async () => {
    const expectedError = new Error('sometimes it happens');
    expectedError.name = 'StreamError';

    let reqRef = null;
    mock.method(https, 'request', () => {
      reqRef = new ServerResponseStub();
      return reqRef;
    });

    const requestPromise = get({
      url,
      token
    });

    reqRef.emit('error', expectedError);

    await assert.rejects(requestPromise, (error) => error === expectedError);
  });

  test('should send data', () => {
    let reqRef = null;
    mock.method(https, 'request', () => {
      reqRef = new ServerResponseStub();
      return reqRef;
    });

    post({
      url,
      method,
      token,
      data
    });

    assert.equal(reqRef._data, JSON.stringify(data));
  });

  describe('wrappers', () => {
    for (const [name, fn, hasBody] of [
      ['GET-wrapper', get, false],
      ['POST-wrapper', post, true],
      ['PUT-wrapper', put, true],
      ['PATCH-wrapper', patch, true],
      ['DELETE-wrapper', deleteRequest, false]
    ]) {
      test(name, () => {
        const httpMethod = name.replace('-wrapper', '');
        let reqRef = null;
        const httpsMock = mock.method(https, 'request', () => {
          reqRef = new ServerResponseStub();
          return reqRef;
        });

        fn({ url, token, query, ...(hasBody ? { data } : {}) });

        assert.equal(httpsMock.mock.calls[0].arguments[0].method, httpMethod);
        assert.equal(
          httpsMock.mock.calls[0].arguments[0].path,
          `${urlOptions.path}?${queryString}`
        );
        if (hasBody) {
          assert.equal(reqRef._data, JSON.stringify(data));
        } else {
          assert.equal(reqRef._data, '');
        }
      });
    }
  });
});
