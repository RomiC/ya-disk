const assert = require('assert');
const sinon = require('sinon');
const https = require('https');
const {PassThrough} = require('stream');
const {parse: urlParse} = require('url');
const {stringify: queryStringfy} = require('querystring');

const request = require('../src/request');

const url = 'https://cloud-api.yandex.net/v1/disk';
const urlParsed = urlParse(url)
const token = '123123123';
const method = 'HEAD';

describe('request', () => {
  it('should pass correct default params to https.request', (done) => {
    sinon.spy(https, 'request');
  
    const {
      host: expectHost,
      path: expectPath,
      expectMethod = 'GET',
      expectAuthHeader = `OAuth ${token}`
    } = urlParsed;
  
    request({
      url,
      token
    });
  
    const {args: [args]} = https.request.getCall(0);
  
    assert.equal(args.host, expectHost, `Host should be equal '${expectHost}', got ${args.host}`);
    assert.equal(args.path, expectPath, `Path should be equal '${expectPath}', got ${args.path}`);
    assert.equal(args.method, expectMethod, `Host should be equal '${expectMethod}', got ${args.method}`);
    assert.equal(args.headers['Authorization'], expectAuthHeader, `Auth header should be equal '${expectAuthHeader}', got ${args.headers}`);
  
    https.request.restore();
    done();
  });
  
  it('should pass correct params to https.request', (done) => {
    sinon.spy(https, 'request');
    const {
      host: expectHost,
      path: expectPath,
      expectMethod = method,
      expectAuthHeader = `OAuth ${token}`
    } = urlParsed;
    
    request({
      url,
      token,
      method
    });
    
    const {args: [args]} = https.request.getCall(0);
  
    assert.equal(args.host, expectHost, `Host should be equal '${expectHost}', got ${args.host}`);
    assert.equal(args.path, expectPath, `Path should be equal '${expectPath}', got ${args.path}`);
    assert.equal(args.method, expectMethod, `Host should be equal '${expectMethod}', got ${args.method}`);
    assert.equal(args.headers['Authorization'], expectAuthHeader, `Auth header should be equal '${expectAuthHeader}', got ${args.headers}`);
  
    https.request.restore();
    done();
  });
});