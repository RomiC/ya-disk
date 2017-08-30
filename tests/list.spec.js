import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import list from '../lib/list';

import { API_TOKEN } from './constants';
import { API_FILES_URL } from '../lib/constants';

const options = {
  limit: 13,
  media_type: 'diskimage,settings,image',
  offset: 3,
  preview_size: '130x',
  preview_crop: true
};

test('should call request.get ', (t) => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: API_FILES_URL,
    token: API_TOKEN,
    query: options
  });

  list(API_TOKEN, options);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});