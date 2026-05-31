import assert from 'node:assert/strict';
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
const query = {
  foo: 'string',
  bar: 3
};
const data = {
  baz: 4,
  zoom: 'zoom'
};
const queryString = new URLSearchParams(query).toString();
const authHeader = `OAuth ${token}`;

const mockFetch = (body, status = 200) =>
  mock.method(
    globalThis,
    'fetch',
    async () =>
      new Response(body === null ? '' : JSON.stringify(body), { status })
  );

afterEach(() => mock.restoreAll());

describe('request', () => {
  test('should have proper default params and pass them to fetch', async () => {
    const fetchMock = mockFetch(null, 200);

    await get({ url, token });

    const [calledUrl, calledOptions] = fetchMock.mock.calls[0].arguments;
    assert.equal(calledUrl.href, url);
    assert.deepStrictEqual(calledOptions, {
      method: 'GET',
      headers: { Authorization: authHeader }
    });
  });

  test('should call fetch with correct params', async () => {
    const fetchMock = mockFetch(null, 200);

    await post({ url, token, query });

    const [calledUrl, calledOptions] = fetchMock.mock.calls[0].arguments;
    assert.equal(calledUrl.href, `${url}?${queryString}`);
    assert.deepStrictEqual(calledOptions, {
      method: 'POST',
      headers: { Authorization: authHeader }
    });
  });

  test('should strip empty query params before calling fetch', async () => {
    const fetchMock = mockFetch(null, 200);

    await post({
      url,
      token,
      query: {
        foo: 'string',
        bar: 3,
        empty: '',
        missing: undefined,
        nil: null
      }
    });

    const [calledUrl] = fetchMock.mock.calls[0].arguments;
    assert.equal(calledUrl.href, `${url}?${queryString}`);
  });

  test('should omit query string when all query params are empty', async () => {
    const fetchMock = mockFetch(null, 200);

    await post({
      url,
      token,
      query: {
        empty: '',
        missing: undefined,
        nil: null
      }
    });

    const [calledUrl] = fetchMock.mock.calls[0].arguments;
    assert.equal(calledUrl.href, url);
  });

  test('should resolve Promise with parsed result and status code', async () => {
    const expectedResponse = {
      param1: 4631577437,
      param2: 'disk:/Загрузки/',
      param3: {
        param4: 'disk:/Приложения'
      }
    };

    mockFetch(expectedResponse, 200);

    const result = await get({ url, token });
    assert.deepStrictEqual(result, {
      data: expectedResponse,
      status: 200
    });
  });

  test('should resolve with null data and status code when response is empty', async () => {
    mockFetch(null, 201);

    const result = await get({ url, token });
    assert.deepStrictEqual(result, { data: null, status: 201 });
  });

  test(`should reject with Error when response code isn't 2xx`, async () => {
    const expectedResponse = {
      description: 'resource already exists',
      error: 'PlatformResourceAlreadyExists'
    };

    mockFetch(expectedResponse, 401);

    await assert.rejects(
      get({ url, token }),
      (error) =>
        error instanceof Error &&
        error.message === expectedResponse.description &&
        error.name === expectedResponse.error
    );
  });

  test('should reject with Error when response body is not valid JSON', async () => {
    mock.method(
      globalThis,
      'fetch',
      async () => new Response('<html>Bad Gateway</html>', { status: 200 })
    );

    await assert.rejects(
      get({ url, token }),
      (error) =>
        error instanceof Error &&
        error.message.includes('502') === false &&
        error.message.includes('<html>Bad Gateway</html>')
    );
  });

  test('should reject with fallback Error when non-2xx response body is not valid JSON', async () => {
    mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response('<html>Service Unavailable</html>', { status: 503 })
    );

    await assert.rejects(
      get({ url, token }),
      (error) =>
        error instanceof Error &&
        error.message.includes('503') &&
        error.message.includes('<html>Service Unavailable</html>')
    );
  });

  test('should reject with fallback Error when non-2xx response body is empty', async () => {
    mock.method(
      globalThis,
      'fetch',
      async () => new Response('', { status: 503 })
    );

    await assert.rejects(
      get({ url, token }),
      (error) =>
        error instanceof Error &&
        error.message === 'Request failed with status 503' &&
        error.name === 'ApiError'
    );
  });

  test('should reject when fetch fails with a network error', async () => {
    const expectedError = new TypeError('network error');
    mock.method(globalThis, 'fetch', async () => {
      throw expectedError;
    });

    await assert.rejects(
      get({ url, token }),
      (error) => error === expectedError
    );
  });

  test('should send data', async () => {
    const fetchMock = mockFetch(null, 200);

    await post({ url, token, data });

    const [, calledOptions] = fetchMock.mock.calls[0].arguments;
    assert.equal(calledOptions.body, JSON.stringify(data));
  });

  describe('wrappers', () => {
    for (const [name, fn, hasBody] of [
      ['GET-wrapper', get, false],
      ['POST-wrapper', post, true],
      ['PUT-wrapper', put, true],
      ['PATCH-wrapper', patch, true],
      ['DELETE-wrapper', deleteRequest, false]
    ]) {
      test(name, async () => {
        const httpMethod = name.replace('-wrapper', '');
        const fetchMock = mockFetch(null, 200);

        await fn({ url, token, query, ...(hasBody ? { data } : {}) });

        const [calledUrl, calledOptions] = fetchMock.mock.calls[0].arguments;
        assert.equal(calledOptions.method, httpMethod);
        assert.equal(calledUrl.href, `${url}?${queryString}`);
        if (hasBody) {
          assert.equal(calledOptions.body, JSON.stringify(data));
        } else {
          assert.equal(calledOptions.body, undefined);
        }
      });
    }
  });
});
