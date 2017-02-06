import {spy, stub} from 'sinon';
import test from 'ava';

import request from '../src/request';
import {link} from '../src/download';

import {API_TOKEN} from './constants';
import {API_DOWNLOAD_LINK_URL} from '../src/constants'

const path = 'disk:/Море.jpg';

test.after(() => {
  if (typeof request.do.restore === 'function') {
    request.do.restore();
  }
});

test('download', (t) => {
  const doSpy = spy(request, 'do');
  
  link(API_TOKEN, path);
  
  const args = doSpy.args[0][0];
  t.true(doSpy.calledOnce, 'should call the request.do method');
  t.is(args.url, API_DOWNLOAD_LINK_URL, 'should provide the correct url');
  t.is(args.token, API_TOKEN, 'should pass the correct token');
  t.deepEqual(args.query, {path}, 'should pass the correct params in query');
});