import { mock } from 'sinon';
import test from 'ava';

import request from '../lib/request';
import {create,remove,copy,move} from '../lib/resources';

import { API_TOKEN } from './constants';
import { API_RESOURCES_URL, API_COPY_URL, API_MOVE_URL } from '../lib/constants';

const folderName='disk:/folderName';
const folder2Name='disk:/folder2Name';
const permanently=true;

test('create folder', (t) => {
  const requestMock = mock(request);

  requestMock.expects('put').once().withArgs({
    url: API_RESOURCES_URL,
    token: API_TOKEN,
    query: {
      path: folderName
    }
  });

  create(API_TOKEN,folderName);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test('remove folder or file', (t) => {
  const requestMock = mock(request);

  requestMock.expects('delete').once().withArgs({
    url: API_RESOURCES_URL,
    token: API_TOKEN,
    query: {
      path: folderName,
      permanently: permanently
    }
  });

  remove(API_TOKEN,folderName,permanently);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test('copy folder or file', (t) => {
  const requestMock = mock(request);

  requestMock.expects('post').once().withArgs({
    url: API_COPY_URL,
    token: API_TOKEN,
    query: {
      from: folderName,
      path: folder2Name,
      overwrite: false,
      fields: ''
    }
  });

  copy(API_TOKEN, folderName, folder2Name);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});

test('move folder or file', (t) => {
  const requestMock = mock(request);

  requestMock.expects('post').once().withArgs({
    url: API_MOVE_URL,
    token: API_TOKEN,
    query: {
      from: folderName,
      path: folder2Name,
      overwrite: false,
      fields: ''
    }
  });

  move(API_TOKEN, folderName, folder2Name);

  requestMock.verify();
  requestMock.restore();

  t.pass();
});