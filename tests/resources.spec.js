import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import {create,remove} from '../lib/resources';

import { API_TOKEN } from './constants';
import { API_DISK_URL } from '../lib/constants';

const folderName='disk:/folderName';
const permanently=true;

test('create folder', (t) => {
  const requestMock = mock(request);

  requestMock.expects('put').once().withArgs({
    url: API_DISK_URL,
    token: API_TOKEN,
    query: {
      path: folderName
    }
  });

  create(API_TOKEN);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test('remove folder or file', (t) => {
  const requestMock = mock(request);

  requestMock.expects('delete').once().withArgs({
    url: API_DISK_URL,
    token: API_TOKEN,
    query: {
      path: folderName,
      permanently: permanently
    }
  });

  remove(API_TOKEN);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});