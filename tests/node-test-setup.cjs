const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const nodeTest = require('node:test');
const { ModuleMocker } = require('jest-mock');

const expectExport = require('expect');
const expect = expectExport.expect || expectExport.default || expectExport;

const moduleMocker = new ModuleMocker(global);
const moduleMocks = new Map();
const originalLoad = Module._load;

const getCallerFile = () => {
  const err = new Error();
  const stack = String(err.stack || '').split('\n').slice(2);

  for (const line of stack) {
    const match = line.match(/\((.*?):\d+:\d+\)$/) || line.match(/at (.*?):\d+:\d+$/);
    if (!match) {
      continue;
    }

    const filePath = match[1];
    if (
      filePath &&
      !filePath.endsWith('node-test-setup.cjs') &&
      filePath.includes(path.sep)
    ) {
      return filePath;
    }
  }

  return null;
};

const resolveMockExport = (request, parentModule) => {
  if (!request.startsWith('.') && !request.startsWith('/')) {
    const coreMockPath = path.join(process.cwd(), 'tests', '__mocks__', `${request}.js`);
    if (fs.existsSync(coreMockPath)) {
      return require(coreMockPath);
    }

    return null;
  }

  const resolved = Module._resolveFilename(request, parentModule);
  const mockPath = path.join(
    path.dirname(resolved),
    '__mocks__',
    path.basename(resolved)
  );

  if (fs.existsSync(mockPath)) {
    return require(mockPath);
  }

  return null;
};

Module._load = function patchedLoad(request, parent, isMain) {
  const resolved = Module._resolveFilename(request, parent, isMain);
  if (moduleMocks.has(resolved)) {
    return moduleMocks.get(resolved);
  }

  return originalLoad.apply(this, arguments);
};

const wrapDoneCallback = (fn) => async () =>
  await new Promise((resolve, reject) => {
    let doneCalled = false;
    const done = (err) => {
      if (doneCalled) {
        return;
      }
      doneCalled = true;

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    };

    try {
      fn(done);
    } catch (error) {
      reject(error);
    }
  });

const wrapHook = (fn) => {
  if (typeof fn !== 'function') {
    return fn;
  }

  if (fn.length > 0) {
    return wrapDoneCallback(fn);
  }

  return fn;
};

const wrapTest = (fn) => {
  if (typeof fn !== 'function') {
    return fn;
  }

  if (fn.length > 0) {
    return wrapDoneCallback(fn);
  }

  return fn;
};

global.expect = expect;
global.test = (name, options, fn) => {
  if (typeof options === 'function') {
    return nodeTest.test(name, wrapTest(options));
  }
  return nodeTest.test(name, options, wrapTest(fn));
};
global.it = global.test;
global.describe = (name, options, fn) => {
  if (typeof options === 'function') {
    return nodeTest.describe(name, wrapHook(options));
  }
  return nodeTest.describe(name, options, wrapHook(fn));
};
global.beforeEach = (fn, options) => nodeTest.beforeEach(wrapHook(fn), options);
global.afterEach = (fn, options) => nodeTest.afterEach(wrapHook(fn), options);
global.beforeAll = (fn, options) => nodeTest.before(wrapHook(fn), options);
global.afterAll = (fn, options) => nodeTest.after(wrapHook(fn), options);

nodeTest.beforeEach(() => moduleMocker.clearAllMocks());

global.jest = {
  fn: moduleMocker.fn.bind(moduleMocker),
  clearAllMocks: moduleMocker.clearAllMocks.bind(moduleMocker),
  mock(request) {
    const caller = getCallerFile();
    if (!caller) {
      throw new Error(`Unable to resolve caller for jest.mock('${request}')`);
    }

    const parentModule = {
      id: caller,
      filename: caller,
      paths: Module._nodeModulePaths(path.dirname(caller))
    };

    const mockExport = resolveMockExport(request, parentModule);
    if (!mockExport) {
      throw new Error(`Unable to resolve manual mock for '${request}'`);
    }

    const resolved = Module._resolveFilename(request, parentModule);
    moduleMocks.set(resolved, mockExport);
    delete require.cache[resolved];
  }
};

