import test from 'ava';
import { mock } from 'sinon';

import request from '../lib/request';
import { link, remoteFile } from '../lib/upload';

import { API_TOKEN } from './constants';
import { API_UPLOAD_LINK_URL } from '../lib/constants';

const path = 'disk:/file.txt';
const overwrite = true;
const url = 'https://example.com/file.txt';

test('link', (t) => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: API_UPLOAD_LINK_URL,
    token: API_TOKEN,
    query: {
      path: path,
      overwrite: overwrite
    }
  });

  link(API_TOKEN, path, overwrite);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test('remoteFile', (t) => {
  const requestMock = mock(request);

  requestMock.expects('post').calledWith({
    url: API_UPLOAD_LINK_URL,
    token: API_TOKEN,
    query: {
      url: url,
      path: path
    }
  });

  remoteFile(API_TOKEN, url, path);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});