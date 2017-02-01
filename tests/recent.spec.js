const assert = require('assert');
const sinon = require('sinon');

const request = require('../src/request');
const recent = require('../src/recent');

const {API_TOKEN} = require('./constants');
const {API_RECENT_FILES_URL} = require('../src/constants');

const options = {
  limit: 13,
  media_type: 'backup,book,audio',
  preview_size: '130x',
  preview_crop: false
};

describe('recent', () => {
  afterEach(() => {
    if (typeof request.do.restore === 'function') {
      request.do.restore();
    }
  });
  
  it('should call request.do with correct params', () => {
    const spy = sinon.spy(request, 'do');
    
    recent(API_TOKEN, options);
    
    const args = spy.args[0][0];
    assert.equal(args.url, API_RECENT_FILES_URL, 'should pass the correct url');
    assert.equal(args.token, API_TOKEN, 'should send the correct token');
    assert.deepEqual(args.query, options, 'should pass the correct params in query');
  });
  
  it('should pass the correct params to the success callback', (done) => {
    recent(API_TOKEN, options, (res) => {
      assert.equal(typeof res.items !== 'undefined', true, 'should have the items property');
      assert.equal(typeof res.limit !== 'undefined', true, 'should have the limit property');
      done();
    });
  });
});