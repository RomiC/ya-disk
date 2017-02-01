const assert = require('assert');
const sinon = require('sinon');

const request = require('../src/request');
const list = require('../src/list');

const {API_TOKEN} = require('./constants');
const {API_FILES_URL} = require('../src/constants');

const options = {
  limit: 13,
  media_type: 'diskimage,settings,image',
  offset: 3,
  preview_size: '130x',
  preview_crop: true
};

describe('list', () => {
  afterEach(() => {
    if (typeof request.do.restore === 'function') {
      request.do.restore();
    }
  });
  
  it('should call request.do with correct params', () => {
    const spy = sinon.spy(request, 'do');
    
    list(API_TOKEN, options);
    
    const args = spy.args[0][0];
    assert.equal(args.url, API_FILES_URL, 'should send request to the correct url');
    assert.equal(args.token, API_TOKEN, 'should pass the correct token');
    assert.deepEqual(args.query, options, 'should pass the correct query params');
  });
  
  it('should pass correct args to the callback', (done) => {
    list(API_TOKEN, options, (res) => {
      assert.equal(typeof res.items !== 'undefined', true, 'should contain items property');
      assert.equal(typeof res.limit !== 'undefined', true, 'should contain limit property');
      assert.equal(typeof res.offset !== 'undefined', true, 'should contain offset property');
      done();
    });
  });
});