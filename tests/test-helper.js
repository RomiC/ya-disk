const { mock } = require('node:test');

/**
 * Creates a mock function that returns a promise
 * and exposes _resolve / _reject for manual control.
 *
 * Similar to the previous Jest mock pattern in lib/__mocks__/request.js,
 * allowing tests to manually resolve/reject promises.
 *
 * @returns {function} Mock function with _resolve and _reject attached
 */
function createRequestMock() {
  const mockFn = () =>
    new Promise((resolve, reject) => {
      mockFn._resolve = resolve;
      mockFn._reject = reject;
    });

  return mockFn;
}

/**
 * Mocks all request methods (get, post, put, patch, delete)
 * on a given request module using createRequestMock().
 *
 * @param {object} requestModule - The request module to mock methods on
 * @returns {object} Object containing all created mock functions
 */
function mockRequestModule(requestModule) {
  const mocks = {};

  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    mocks[method] = createRequestMock();
    mock.method(requestModule, method, mocks[method]);
  }

  return mocks;
}

module.exports = { createRequestMock, mockRequestModule };
