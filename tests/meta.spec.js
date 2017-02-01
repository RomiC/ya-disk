const assert = require('assert');
const sinon = require('sinon');
const https = require('https');

const request = require('../src/request');
const meta = require('../src/meta');

const {API_TOKEN, APP_NAME} = require('./constants');
const {API_RESOURCES_URL} = require('../src/constants');

const path = `disk:/Приложения/${APP_NAME}/file1.txt`;
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

describe('meta', () => {
  describe('get', () => {
    afterEach(() => {
      if (typeof request.do.restore === 'function') {
        request.do.restore();
      }
    });

    it('should call request.do with correct params', () => {
      const spy = sinon.spy(request, 'do');

      meta.get(API_TOKEN, path, options);

      const args = spy.args[0][0];
      assert.equal(args.url, API_RESOURCES_URL, 'should have the correct url');
      assert.equal(args.token, API_TOKEN, 'should send the correct token');
      assert.deepEqual(args.query, Object.assign({path}, options), 'should pass the correct params in query');
    });

    it('should pass the correct args to the success callback', (done) => {
      meta.get(API_TOKEN, `disk:/Приложения/`, options, (res) => {
        assert.equal(typeof res.name !== 'undefined', true, 'should have the name field');
        assert.equal(typeof res.created !== 'undefined', true, 'should have the created field');
        assert.equal(typeof res.resource_id !== 'undefined', true, 'should have the resource_id field');
        assert.equal(typeof res.modified !== 'undefined', true, 'should have the modified field');
        assert.equal(typeof res.path !== 'undefined', true, 'should have the path field');
        assert.equal(typeof res.type !== 'undefined', true, 'should have the type field');
        assert.equal(typeof res.type !== 'undefined', true, 'should have the type field');
        assert.equal(typeof res.revision !== 'undefined', true, 'should have the revision field');
        done();
      });
    });
  });
  
  describe('add', () => {
    afterEach(() => {
      if (typeof request.do.restore === 'function') {
        request.do.restore();
      }
    });
  
    it('should call request.do with correct params', () => {
      const spy = sinon.spy(request, 'do');
      
      meta.add(API_TOKEN, `disk:/Приложения`, props);
      
      const args = spy.args[0][0];
      assert.equal(args.url, API_RESOURCES_URL, 'should have the correct url');
      assert.equal(args.method, 'PUT', 'should use PUT method');
      assert.equal(args.token, API_TOKEN, 'should send the correct token');
      assert.deepEqual(args.data, props, 'should send correct data');
    });
  });
});

