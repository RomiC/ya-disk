const https = require('https');
const { Readable } = require('stream');
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
const onSuccess = jest.fn();
const onError = jest.fn();

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

jest.mock('https');

afterEach(() => jest.clearAllMocks());

test('should have proper default params and pass them to https.request', () => {
  request.request({
    url,
    token
  });

  expect(https.request).toHaveBeenLastCalledWith(
    Object.assign(urlParsed, {
      method: 'GET',
      headers: { Authorization: authHeader }
    }),
    expect.any(Function)
  );
});

test('should call https.request with correct params', () => {
  request.request({
    url,
    token,
    method,
    query
  });

  expect(https.request).toHaveBeenCalledWith(
    Object.assign({}, urlParsed, {
      method,
      path: `${urlParsed.path}?${queryString}`,
      headers: {
        Authorization: authHeader
      }
    }),
    expect.any(Function)
  );
});

test('should call onSuccess-callback with parsed result and status code', (done) => {
  const expectedResponse = {
    param1: 4631577437,
    param2: 'disk:/Загрузки/',
    param3: {
      param4: 'disk:/Приложения'
    }
  };

  request.request(
    {
      url,
      token
    },
    onSuccess
  );

  const res = new IncomingMessageStub(JSON.stringify(expectedResponse), 200);

  https.request._requestCallback(res);

  res.on('end', function() {
    expect(onSuccess).toHaveBeenCalledWith(expectedResponse, res.statusCode);
    done();
  });
});

test('should call onSuccess-callback with null and status code when response is empty', (done) => {
  request.request(
    {
      url,
      token
    },
    onSuccess
  );

  const res = new IncomingMessageStub('', 201);

  https.request._requestCallback(res);

  res.on('end', function() {
    expect(onSuccess).toHaveBeenCalledWith(null, 201);
    done();
  });
});

test(`should call onError-callback with Error instance when response code isn't 2xx`, (done) => {
  const expectedResponse = {
    description: 'resource already exists',
    error: 'PlatformResourceAlreadyExists'
  };

  request.request(
    {
      url,
      token
    },
    null,
    onError
  );

  const res = new IncomingMessageStub(JSON.stringify(expectedResponse), 401);

  https.request._requestCallback(res);

  res.on('end', () => {
    const expectedError = new Error(expectedResponse.description);
    expectedError.name = expectedResponse.error;

    expect(onError).toHaveBeenCalledWith(expectedError);
    done();
  });
});

test('should call onError-callback when https.request failed', (done) => {
  const error = new Error('sometimes it happens');
  error.name = 'StreamError';

  request.request(
    {
      url,
      token
    },
    null,
    onError
  );

  https.request._serverResponse.on('error', () => {
    expect(onError).toHaveBeenCalledWith(error);
    done();
  });

  https.request._serverResponse.emit('error', error);
});

test('should send data', () => {
  request.request({
    url,
    method,
    token,
    data
  });

  expect(https.request._serverResponse._data).toBe(JSON.stringify(data));
});

describe('wrappers', () => {
  let originalRequest = request.request;

  beforeEach(() => {
    request.request = jest.fn();
  });

  afterEach(() => {
    request.request = originalRequest;
  });

  test('GET-wrapper', () => {
    request.get({
      url: url,
      token: token,
      query: query
    });

    expect(request.request).toHaveBeenCalledWith({
      url: url,
      token: token,
      method: 'GET',
      query: query
    });
  });

  test('POST-wrapper', () => {
    request.post({
      url: url,
      token: token,
      query: query,
      data: data
    });

    expect(request.request).toHaveBeenCalledWith({
      url: url,
      token: token,
      method: 'POST',
      query: query,
      data: data
    });
  });

  test('PUT-wrapper', () => {
    request.put({
      url,
      token: token,
      query,
      data
    });

    expect(request.request).toHaveBeenCalledWith({
      url,
      token: token,
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

    expect(request.request).toHaveBeenCalledWith({
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

    expect(request.request).toHaveBeenCalledWith({
      url,
      token,
      method: 'DELETE',
      data,
      query
    });
  });
});
