import test from 'ava';

import yaDisk from '../index';

test('it should export all methods', (t) => {
  t.is(typeof yaDisk.download, 'object', 'download should be an object');
  t.is(typeof yaDisk.download.link, 'function', 'download.link should be a function');
  t.is(typeof yaDisk.info, 'function', 'info should be a function');
  t.is(typeof yaDisk.list, 'function', 'list should be a function');
  t.is(typeof yaDisk.meta, 'object', 'meta should be an object');
  t.is(typeof yaDisk.meta.add, 'function', 'meta.add should be a function');
  t.is(typeof yaDisk.meta.get, 'function', 'meta.get should be a function');
  t.is(typeof yaDisk.operations, 'function', 'opeartions should be a funtion');
  t.is(typeof yaDisk.recent, 'function', 'recent should be a funtion');
  t.is(typeof yaDisk.upload, 'object', 'upload should be an object');
  t.is(typeof yaDisk.upload.link, 'function', 'upload.link should be a function');
  t.is(typeof yaDisk.upload.remoteFile, 'function', 'upload.remoteFile should be a function');
});