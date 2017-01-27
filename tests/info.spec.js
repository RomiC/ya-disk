const assert = require('assert');
const https = require('https');

const request = require('../src/request');
const info = require('../src/info');

const {API_KEY} = require('./constants');

describe('info', () => {
  it('should call callback with correct args', (done) => {
    info(API_KEY, ({total_space, used_space, trash_size, system_folders}) => {
      assert.equal(typeof total_space !== 'undefined', true, 'Response should contain total space field');
      assert.equal(typeof used_space !== 'undefined', true, 'Response should contain used space field');
      assert.equal(typeof trash_size !== 'undefined', true, 'Response should contain trash size field');
      assert.equal(typeof system_folders !== 'undefined', true, 'Response should contain list of system folders');
      done();
    });
  })
});
