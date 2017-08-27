import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import recent from '../lib/recent';

import { API_TOKEN } from './constants';
import { API_RECENT_FILES_URL } from '../lib/constants';

const options = {
  limit: 13,
  media_type: 'backup,book,audio',
  preview_size: '130x',
  preview_crop: false
};

test('should call request.do with correct params', () => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: API_RECENT_FILES_URL,
    token: API_TOKEN,
    options: options
  });

  recent(API_TOKEN, options);

  requestMock.verify();
  requestMock.restore();
});