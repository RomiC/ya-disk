const request = require('../lib/request');
const {
  create,
  remove,
  copy,
  move,
  publish,
  unpublish
} = require('../lib/resources');

const { API_TOKEN } = require('./constants');
const {
  API_RESOURCES_URL,
  API_COPY_URL,
  API_MOVE_URL,
  API_PUBLISH_URL,
  API_UNPUBLISH_URL
} = require('../lib/constants');

const folderName = 'disk:/folderName';
const folder2Name = 'disk:/folder2Name';
const overwrite = true;
const fields = 'field1,field2';
const permanently = true;
const onSuccessCallback = jest.fn();
const onErrorCallback = jest.fn();

jest.mock('../lib/request');

test('create folder', () => {
  create(API_TOKEN, folderName, onSuccessCallback, onErrorCallback);

  expect(request.put).toHaveBeenCalledWith(
    {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('remove folder or file', () => {
  remove(
    API_TOKEN,
    folderName,
    permanently,
    onSuccessCallback,
    onErrorCallback
  );

  expect(request.delete).toHaveBeenCalledWith(
    {
      url: API_RESOURCES_URL,
      token: API_TOKEN,
      query: {
        path: folderName,
        permanently: permanently
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('copy folder or file', () => {
  copy(
    API_TOKEN,
    folderName,
    folder2Name,
    overwrite,
    fields,
    onSuccessCallback,
    onErrorCallback
  );

  expect(request.post).toHaveBeenCalledWith(
    {
      url: API_COPY_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('move folder or file', () => {
  move(
    API_TOKEN,
    folderName,
    folder2Name,
    overwrite,
    fields,
    onSuccessCallback,
    onErrorCallback
  );

  expect(request.post).toHaveBeenCalledWith(
    {
      url: API_MOVE_URL,
      token: API_TOKEN,
      query: {
        from: folderName,
        path: folder2Name,
        overwrite,
        fields
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('publish folder or file', () => {
  publish(API_TOKEN, folderName, onSuccessCallback, onErrorCallback);

  expect(request.put).toHaveBeenCalledWith(
    {
      url: API_PUBLISH_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});

test('unpublish folder or file', () => {
  unpublish(API_TOKEN, folderName, onSuccessCallback, onErrorCallback);

  expect(request.put).toHaveBeenCalledWith(
    {
      url: API_UNPUBLISH_URL,
      token: API_TOKEN,
      query: {
        path: folderName
      }
    },
    onSuccessCallback,
    onErrorCallback
  );
});
