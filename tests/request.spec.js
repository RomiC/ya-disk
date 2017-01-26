const assert = require('assert');
const sinon = require('sinon');
const https = require('https');
const {PassThrough} = require('stream');
const {parse: urlParse} = require('url');
const {stringify: queryStringfy} = require('querystring');

const request = require('../src/request');

const url = 'https://cloud-api.yandex.net/v1/disk';
const urlParsed = urlParse(url);
const token = '123123123';
const method = 'POST';
const query = {
  foo: 'string',
  bar: 3
};
const data = {"custom_properties": {"foo": "1","bar": "2"}};

describe('request', () => {
  afterEach(() => {
    if (typeof https.request.restore === 'function') {
      https.request.restore();
    }
  });

  it('should call https.request with correct default params', () => {
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
  });
  
  it('should call https.request with correct params', () => {
    sinon.spy(https, 'request');

    const {
      host: expectHost,
      path: expectPath,
      expectMethod = method,
      expectAuthHeader = `OAuth ${token}`,
      expectQuery = queryStringfy(query)
    } = urlParsed;
    
    request({
      url,
      token,
      method,
      query
    });
    
    const {args: [args]} = https.request.getCall(0);
  
    assert.equal(args.host, expectHost, `should have valid Host`);
    assert.equal(args.path, `${expectPath}?${expectQuery}`, `should have valid Path`);
    assert.equal(args.method, expectMethod, `should called with correct Method`);
    assert.equal(args.headers['Authorization'], expectAuthHeader, `should send correct auth header`);
  });
  
  it('should call success callback with correct data', (done) => {
    const httpsRequest = sinon.stub(https, 'request');
    
    const expectedArg = {
      "trash_size": 4631577437,
      "total_space": 319975063552,
      "used_space": 26157681270,
      "system_folders": {
        "applications": "disk:/Приложения",
        "downloads": "disk:/Загрузки/"
      }
    };
    
    const res = new PassThrough;
    res.statusCode = 200;
    res.write(JSON.stringify(expectedArg));
    res.end();
    
    const req = new PassThrough;

    httpsRequest.callsArgWith(1, res)
      .returns(req);
    
    request(
      {
        url,
        token
      },
      (res) => {
        assert.deepEqual(res, expectedArg, 'Should be called with correct args');
        done();
      }
    );
  });
  
  it('should call error callback with error info', (done) => {
    const httpsRequest = sinon.stub(https, 'request');
    
    const expectedArg = {
      "description": "resource already exists",
      "error": "PlatformResourceAlreadyExists"
    };
    
    const res = new PassThrough;
    res.statusCode = 401;
    res.write(JSON.stringify(expectedArg));
    res.end();
    
    const req = new PassThrough;
    
    httpsRequest.callsArgWith(1, res)
      .returns(req);
    
    request(
      {
        url,
        token
      },
      null,
      (err) => {
        assert.equal(err.name, expectedArg.error, 'Error should have a proper name');
        assert.equal(err.message, expectedArg.description, 'Error should have a proper description');
        done();
      }
    );
  });
  
  it('should call send correct data', () => {
    const httpsRequest = sinon.stub(https, 'request');

    const req = new PassThrough;
    const reqSpy = sinon.spy(req, 'write');
    
    httpsRequest.returns(req);

    request({
      url,
      method,
      token,
      data
    });
    
    assert.equal(reqSpy.args[0][0], JSON.stringify(data), 'Data should be the same');
  });
});