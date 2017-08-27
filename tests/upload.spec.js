import test from 'ava';
import { mock } from 'sinon';

import request from '../lib/request';
import { link } from '../lib/upload';

import { API_TOKEN } from './constants';
import { API_UPLOAD_LINK_URL } from '../lib/constants';

const path = 'disk:/file.txt';
const overwrite = true;

test('should call request.get with correct params', () => {
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
});