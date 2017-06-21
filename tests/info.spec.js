import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import info from '../lib/info';

import { API_TOKEN } from './constants';
import { API_DISK_URL } from '../lib/constants';

test('should call request.do with correct params', () => {
  const requestMock = mock(request);

  requestMock.expects('get').once().withArgs({
    url: API_DISK_URL,
    token: API_TOKEN
  });

  info(API_TOKEN);

  requestMock.verify();
  requestMock.restore();
});