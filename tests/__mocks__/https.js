const { Writable } = require('stream');

class ServerResponseStub extends Writable {
  constructor() {
    super();

    this._data = '';
  }

  _write(chunk) {
    this._data += chunk;
  }
}

const request = jest.fn((_, callback) => {
  request._requestCallback = callback;
  request._serverResponse = new ServerResponseStub();

  return request._serverResponse;
});

module.exports = { request };
