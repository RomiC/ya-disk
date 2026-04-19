const request = require('../lib/request');
const trash = require('../lib/trash');

const { API_TOKEN } = require('./constants');
const { API_TRASH_URL, API_RESTORE_URL } = require('../lib/constants');

const path = '/foo/photo.png';
const name = 'photo-restored.png';
const overwrite = true;
const onSuccessCallback = jest.fn();
const onErrorCallback = jest.fn();

jest.mock('../lib/request');

describe('delete', () => {
  it('should call request.delete with path', () => {
    trash.delete(API_TOKEN, path, onSuccessCallback, onErrorCallback);

    expect(request.delete).toHaveBeenCalledWith(
      {
        url: API_TRASH_URL,
        token: API_TOKEN,
        query: { path }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });

  it('should allow omitted path', () => {
    trash.delete(API_TOKEN, undefined, onSuccessCallback, onErrorCallback);

    expect(request.delete).toHaveBeenCalledWith(
      {
        url: API_TRASH_URL,
        token: API_TOKEN,
        query: { path: undefined }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });
});

describe('restore', () => {
  it('should call request.put and pass all params', () => {
    trash.restore(
      API_TOKEN,
      path,
      name,
      overwrite,
      onSuccessCallback,
      onErrorCallback
    );

    expect(request.put).toHaveBeenCalledWith(
      {
        url: API_RESTORE_URL,
        token: API_TOKEN,
        query: { path, name, overwrite }
      },
      onSuccessCallback,
      onErrorCallback
    );
  });

  it('should use overwrite=false by default', () => {
    trash.restore(API_TOKEN, path, undefined, undefined, onSuccessCallback);

    expect(request.put).toHaveBeenCalledWith(
      {
        url: API_RESTORE_URL,
        token: API_TOKEN,
        query: { path, name: undefined, overwrite: false }
      },
      onSuccessCallback,
      undefined
    );
  });
});
