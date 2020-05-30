function createRequestMock() {
  const mockFn = jest.fn(
    () =>
      new Promise((resolve, reject) => {
        mockFn._resolve = resolve;
        mockFn._reject = reject;
      })
  );

  return mockFn;
}

module.exports = {
  delete: createRequestMock(),
  get: createRequestMock(),
  patch: createRequestMock(),
  post: createRequestMock(),
  put: createRequestMock()
};
