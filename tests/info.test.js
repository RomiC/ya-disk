import {mock} from 'sinon';
import test from 'ava';

import request from '../src/request';
import info from '../src/info';

import {API_TOKEN} from './constants';
import {API_DISK_URL} from '../src/constants';

test('should call request.do with correct params', (t) => {
  const requestMock = mock(request);

  requestMock.expects('get').once().withArgs({
    url: API_DISK_URL,
    token: API_TOKEN
  });

  info(API_TOKEN);
  
  requestMock.verify();
  requestMock.restore();
});
