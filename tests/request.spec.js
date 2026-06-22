const assert = require('node:assert/strict');
const { afterEach, beforeEach, describe, mock, test } = require('node:test');
const https = require('https');
const { Readable, Writable } = require('stream');
const { stringify: queryStringify } = require('querystring');
const { parse: urlParse } = require('url');

const request = require('../lib/request');

const { API_TOKEN: token } = require('./constants');

const url = 'https://cloud-api.yandex.net/v1/disk';
const urlParsed = urlParse(url);
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

  _write(chunk) {
    this._data += chunk;
  }
}

// Module-level variables to hold the https.request mock state
let requestCallback;
let serverResponse;

afterEach(() => {
  mock.restoreAll();
  requestCallback = undefined;
  serverResponse = undefined;
});

test('should have proper default params and pass them to https.request', () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  request.request({
    url,
    token
  });

  assert.equal(https.request.mock.calls[0].arguments[0].method, 'GET');
  assert.deepStrictEqual(https.request.mock.calls[0].arguments[0].headers, {
    Authorization: authHeader
  });
});

test('should call https.request with correct params', () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  request.request({
    url,
    token,
    method,
    query
  });

  const calledOpts = https.request.mock.calls[0].arguments[0];
  assert.equal(calledOpts.method, method);
  assert.equal(calledOpts.path, `${urlParsed.path}?${queryString}`);
  assert.deepStrictEqual(calledOpts.headers, {
    Authorization: authHeader
  });
});

test('should strip empty query params before calling https.request', () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  request.request({
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

  const calledOpts = https.request.mock.calls[0].arguments[0];
  assert.equal(calledOpts.method, method);
  assert.equal(calledOpts.path, `${urlParsed.path}?${queryString}`);
  assert.deepStrictEqual(calledOpts.headers, {
    Authorization: authHeader
  });
});

test('should omit query string when all query params are empty', () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  request.request({
    url,
    token,
    method,
    query: {
      empty: '',
      missing: undefined,
      nil: null
    }
  });

  const calledOpts = https.request.mock.calls[0].arguments[0];
  assert.equal(calledOpts.method, method);
  assert.equal(calledOpts.path, urlParsed.path);
  assert.deepStrictEqual(calledOpts.headers, {
    Authorization: authHeader
  });
});

test('should resolve Promise with parsed result and status code', async () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  const expectedResponse = {
    param1: 4631577437,
    param2: 'disk:/Загрузки/',
    param3: {
      param4: 'disk:/Приложения'
    }
  };

  const requestPromise = request.request({
    url,
    token
  });

  const res = new IncomingMessageStub(JSON.stringify(expectedResponse), 200);
  requestCallback(res);

  // Wait for the response stream to end
  await new Promise((resolve) => res.on('end', resolve));

  const result = await requestPromise;
  assert.deepStrictEqual(result, {
    data: expectedResponse,
    status: 200
  });
});

test('should resolve Promise with null and status code when response is empty', async () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  const requestPromise = request.request({
    url,
    token
  });

  const res = new IncomingMessageStub('', 201);
  requestCallback(res);

  await new Promise((resolve) => res.on('end', resolve));

  const result = await requestPromise;
  assert.deepStrictEqual(result, { data: null, status: 201 });
});

test("should reject with Error when response code isn't 2xx", async () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  const expectedResponse = {
    description: 'resource already exists',
    error: 'PlatformResourceAlreadyExists'
  };

  const requestPromise = request.request({
    url,
    token
  });

  const res = new IncomingMessageStub(JSON.stringify(expectedResponse), 401);
  requestCallback(res);

  await new Promise((resolve) => res.on('end', resolve));

  await assert.rejects(requestPromise, (err) => {
    assert.equal(err.message, expectedResponse.description);
    assert.equal(err.name, expectedResponse.error);
    return true;
  });
});

test('should reject with Error when https.request failed', async () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  const expectedError = new Error('sometimes it happens');
  expectedError.name = 'StreamError';

  const requestPromise = request.request({
    url,
    token
  });

  // Emit the error on the server response stream
  serverResponse.emit('error', expectedError);

  await assert.rejects(requestPromise, expectedError);
});

test('should send data', () => {
  mock.method(https, 'request', (opts, cb) => {
    requestCallback = cb;
    serverResponse = new ServerResponseStub();
    return serverResponse;
  });

  request.request({
    url,
    method,
    token,
    data
  });

  assert.equal(serverResponse._data, JSON.stringify(data));
});

describe('wrappers', () => {
  let originalRequest;

  beforeEach(() => {
    originalRequest = request.request;
    request.request = mock.fn();
  });

  afterEach(() => {
    request.request = originalRequest;
  });

  test('GET-wrapper', () => {
    request.get({
      url,
      token,
      query
    });

    assert.deepStrictEqual(request.request.mock.calls[0].arguments[0], {
      url,
      token,
      method: 'GET',
      query
    });
  });

  test('POST-wrapper', () => {
    request.post({
      url,
      token,
      query,
      data
    });

    assert.deepStrictEqual(request.request.mock.calls[0].arguments[0], {
      url,
      token,
      method: 'POST',
      query,
      data
    });
  });

  test('PUT-wrapper', () => {
    request.put({
      url,
      token,
      query,
      data
    });

    assert.deepStrictEqual(request.request.mock.calls[0].arguments[0], {
      url,
      token,
      method: 'PUT',
      query,
      data
    });
  });

  test('PATCH-wrapper', () => {
    request.patch({
      url,
      token,
      query,
      data
    });

    assert.deepStrictEqual(request.request.mock.calls[0].arguments[0], {
      url,
      token,
      method: 'PATCH',
      data,
      query
    });
  });

  test('DELETE-wrapper', () => {
    request.delete({
      url,
      token,
      query,
      data
    });

    assert.deepStrictEqual(request.request.mock.calls[0].arguments[0], {
      url,
      token,
      method: 'DELETE',
      data,
      query
    });
  });
});
