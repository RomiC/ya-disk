import test from 'ava';
import https from 'https';
import { stringify as queryStringfy } from 'querystring';
import { mock, spy, stub } from 'sinon';
import { PassThrough } from 'stream';
import { parse as urlParse } from 'url';

import request from '../lib/request';

import { API_TOKEN } from './constants';

const url = 'https://cloud-api.yandex.net/v1/disk';
const urlParsed = urlParse(url);
const method = 'POST';
const query = {
  foo: 'string',
  bar: 3
};
const data = { "custom_properties": { "foo": "1", "bar": "2" } };

test.afterEach.always(() => {
  if (typeof https.request.restore === 'function') {
    https.request.restore();
  }
});

test.serial('calling https.request with correct DEFAULT params', (t) => {
  const httpsSpy = spy(https, 'request');

  const {
    host: expectHost,
    path: expectPath,
    expectMethod = 'GET',
    expectAuthHeader = `OAuth ${API_TOKEN}`
  } = urlParsed;

  request.request({
    url: url,
    token: API_TOKEN
  });

  const args = httpsSpy.args[0][0];

  t.is(args.host, expectHost, 'Should call with correct host');
  t.is(args.path, expectPath, 'Should call with correct path');
  t.is(args.method, expectMethod, 'Should call with correct method');
  t.deepEqual(args.headers, { 'Authorization': expectAuthHeader }, 'Should call with correct auth header');
});

test.serial('calling https.request with correct params', (t) => {
  const httpsSpy = spy(https, 'request');

  const {
    host: expectHost,
    path: expectPath,
    expectMethod = method,
    expectAuthHeader = `OAuth ${API_TOKEN}`,
    expectQuery = queryStringfy(query)
  } = urlParsed;

  request.request({
    url: url,
    token: API_TOKEN,
    method: method,
    query: query
  });

  const args = httpsSpy.args[0][0];

  t.is(args.host, expectHost, 'Should call with proper host');
  t.is(args.path, `${expectPath}?${expectQuery}`, 'Should call with proper path and query params');
  t.is(args.method, expectMethod, 'Should call with proper method');
  t.deepEqual(args.headers, { 'Authorization': expectAuthHeader }, 'Should call with corrent auth header');
});

test.serial.cb('firing successfull callback with correct params', (t) => {
  const httpsRequest = stub(https, 'request');

  const expectedArg = {
    "trash_size": 4631577437,
    "total_space": 319975063552,
    "used_space": 26157681270,
    "system_folders": {
      "applications": "disk:/Приложения",
      "downloads": "disk:/Загрузки/"
    }
  };

  const res = new PassThrough;
  res.statusCode = 200;
  res.write(JSON.stringify(expectedArg));
  res.end();

  const req = new PassThrough;

  httpsRequest.callsArgWith(1, res)
    .returns(req);

  request.request(
    {
      url,
      API_TOKEN
    },
    (res) => {
      t.deepEqual(res, expectedArg, 'Should be called with correct args');
      t.end();
    }
  );
});

test.serial.cb(`don't parse empty body`, (t) => {
  const httpsRequest = stub(https, 'request');

  const res = new PassThrough;
  res.statusCode = 201;
  res.end();

  const req = new PassThrough;

  httpsRequest.callsArgWith(1, res)
    .returns(req);

  request.request(
    {
      url,
      API_TOKEN,
    },
    (res) => {
      t.is(res, null, 'Should be called with null');
      t.end();
    }
  );
});

test.serial.cb('firing error callback with response error info', (t) => {
  const httpsRequest = stub(https, 'request');

  const expectedArg = {
    "description": "resource already exists",
    "error": "PlatformResourceAlreadyExists"
  };

  const res = new PassThrough;
  res.statusCode = 401;
  res.write(JSON.stringify(expectedArg));
  res.end();

  const req = new PassThrough;

  httpsRequest.callsArgWith(1, res)
    .returns(req);

  request.request(
    {
      url: url,
      token: API_TOKEN
    },
    null,
    (err) => {
      t.is(err.name, expectedArg.error, 'Error should have a proper name');
      t.is(err.message, expectedArg.description, 'Error should have a proper description');
      t.end();
    }
  );
});

test.serial.cb('firing error callback with stream error info', (t) => {
  const httpsRequest = stub(https, 'request');

  const errorMessage = 'sometimes it happens';
  const errorName = 'StreamError';

  const res = new PassThrough;
  res.statusCode = 200;
  res.write(JSON.stringify({ data: 'data' }));
  res.end();

  const req = new PassThrough;

  httpsRequest.callsArgWith(1, res)
    .returns(req);

  request.request(
    {
      url: url,
      token: API_TOKEN
    },
    null,
    (err) => {
      t.is(err.name, errorName, 'Error should have a proper type');
      t.is(err.message, errorMessage, 'Error should have a proper message');
      t.end();
    }
  );

  const error = new Error(errorMessage);
  error.name = errorName;
  req.emit('error', error);
});

test.serial('sending correct data', (t) => {
  const httpsRequest = stub(https, 'request');

  const req = new PassThrough;
  const reqMock = mock(req);

  httpsRequest.returns(req);

  reqMock.expects('write').calledWith(JSON.stringify(data));

  request.request({
    url: url,
    method: method,
    token: API_TOKEN,
    data: data
  });

  reqMock.verify();
  t.pass();
});

test.serial('get wrapper', (t) => {
  const requestMock = mock(request);

  requestMock.expects('request').calledWith({
    url: url,
    token: API_TOKEN,
    method: 'GET',
    query: query
  });

  request.get({
    url: url,
    token: API_TOKEN,
    query: query
  });

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test.serial('post wrapper', (t) => {
  const requestMock = mock(request);

  requestMock.expects('request').calledWith({
    url: url,
    token: API_TOKEN,
    method: 'POST',
    query: query,
    data: data
  });

  request.post({
    url: url,
    token: API_TOKEN,
    query: query,
    data: data
  });

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test.serial('put wrapper', (t) => {
  const requestMock = mock(request);

  requestMock.expects('request').calledWith({
    url: url,
    token: API_TOKEN,
    method: 'PUT',
    data: data
  });

  request.put({
    url: url,
    token: API_TOKEN,
    query: query,
    data: data
  });

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test.serial('patch wrapper', (t) => {
  const requestMock = mock(request);

  requestMock.expects('request').calledWith({
    url: url,
    token: API_TOKEN,
    method: 'PATCH',
    data: data
  });

  request.patch({
    url: url,
    token: API_TOKEN,
    query: query,
    data: data
  });

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test.serial('delete wrapper', (t) => {
  const requestMock = mock(request);

  requestMock.expects('request').calledWith({
    url: url,
    token: API_TOKEN,
    method: 'DELETE',
    data: data
  });

  request.delete({
    url: url,
    token: API_TOKEN,
    query: query,
    data: data
  });

  requestMock.verify();
  requestMock.restore();

  t.pass();
});