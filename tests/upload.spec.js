const assert = require('assert');
const sinon = require('sinon');

const request = require('../src/request');
const upload = require('../src/upload');

const {APP_NAME, API_TOKEN} = require('./constants');
const {API_UPLOAD_LINK_URL} = require('../src/constants');

const path = `disk:/Приложения/${APP_NAME}/tmp1`;
const overwrite = true;

describe('upload', () => {
  describe('link', () => {
    afterEach(() => {
      if (typeof request.do.restore === 'function') {
        request.do.restore();
      }
    });
    
    it('should call request.do with correct params', () => {
      const spy = sinon.spy(request, 'do');
  
      upload.link(API_TOKEN, path, overwrite);
      
      const options = spy.args[0][0];

      assert(spy.calledOnce, 'should call request.do method');
      assert.equal(options.url, API_UPLOAD_LINK_URL, 'should send request to the correct URL');
      assert.equal(options.token, API_TOKEN, 'should pass the correct token');
      assert.equal(options.query.path, path, 'should pass the correct path param in query');
      assert.equal(options.query.overwrite, overwrite, 'should pass the correct overwrite param in query');
    });
    
    it('should pass the correct args to the success callback', (done) => {
      upload.link(API_TOKEN, path, overwrite, ({href, method}) => {
        assert(typeof href !== 'undefined', 'response should contain href property');
        assert(typeof method !== 'undefined', 'response should contain method property');
        done();
      })
    });
  });
});


