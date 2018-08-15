import test from 'ava';
import { mock } from 'sinon';

import request from '../lib/request';
import operations from '../lib/operations';

import { API_TOKEN } from './constants';
import { API_OPERATIONS_URL } from '../lib/constants';

const id = 'MqeRNE6wJFJuKAo7nGAYatqjbUcYo3Hj';

test('status', (t) => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: `${API_OPERATIONS_URL}/${id}`,
    token: API_TOKEN
  });

  operations(API_TOKEN, id);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});