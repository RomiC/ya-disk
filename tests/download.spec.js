import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import { link } from '../lib/download';

import { API_TOKEN } from './constants';
import { API_DOWNLOAD_LINK_URL } from '../lib/constants';

const path = 'disk:/file.txt';

test('should call request.do method with correct params', () => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: API_DOWNLOAD_LINK_URL,
    token: API_TOKEN,
    query: { path }
  });

  link(API_TOKEN, path);

  requestMock.verify();
  requestMock.restore();
});