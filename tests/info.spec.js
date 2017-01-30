const assert = require('assert');
const https = require('https');
const sinon = require('sinon');

const request = require('../src/request');
const info = require('../src/info');

const {API_TOKEN} = require('./constants');
const {API_DISK_URL} = require('../src/constants');

describe('info', () => {
  afterEach(() => {
    if (typeof request.do.restore === 'function') {
      request.do.restore();
    }
  });

  it('should call request.do with correct params', () => {
    const spy = sinon.spy(request, 'do');
  
    info(API_TOKEN);
  
    const options = spy.args[0][0];

    assert(spy.calledOnce, 'Should call request.do method');
    assert.equal(options.url, API_DISK_URL, 'Should provide the correct URL');
    assert.equal(options.token, API_TOKEN, 'Should send the given token');
  });
  
  it('should pass correct params to the success callback', (done) => {
    info(API_TOKEN, ({total_space, used_space, trash_size, system_folders}) => {
      assert.equal(typeof total_space !== 'undefined', true, 'response should contain total space field');
      assert.equal(typeof used_space !== 'undefined', true, 'response should contain used space field');
      assert.equal(typeof trash_size !== 'undefined', true, 'response should contain trash size field');
      assert.equal(typeof system_folders !== 'undefined', true, 'response should contain list of system folders');
      done();
    });
  });
});
