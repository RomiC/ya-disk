import {mock} from 'sinon';
import test from 'ava';

import request from '../src/request';
import meta from '../src/meta';

const {API_TOKEN} = require('./constants');
const {API_RESOURCES_URL} = require('../src/constants');

const path = `disk:/file1.txt`;
const options = {
  sort: 'created',
  limit: 13,
  offset: 9,
  preview_size: 'x120',
  preview_crop: true
};
const props = {
  uno: 'value1',
  duos: {
    tres: 'tres',
    quatros: 'quatros'
  }
};

test('get', () => {
  const requestMock = mock(request);

  requestMock.expects('get').calledWith({
    url: API_RESOURCES_URL,
    token: API_TOKEN,
    query: Object.assign({path}, options)
  });

  meta.get(API_TOKEN, path, options);

  requestMock.verify();
  requestMock.restore();
});

test('add', () => {
  const requestMock = mock(request);

  requestMock.expects('patch').calledWith({
    url: API_RESOURCES_URL,
    token: API_TOKEN,
    data: props
  });

  meta.add(API_TOKEN, path, props);

  requestMock.verify();
  requestMock.restore();
});
