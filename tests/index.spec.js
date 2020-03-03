const yaDisk = require('../index');

test('it should export all methods', () => {
  expect(typeof yaDisk.download).toBe('object');
  expect(typeof yaDisk.download.link).toBe('function');
  expect(typeof yaDisk.info).toBe('function');
  expect(typeof yaDisk.list).toBe('function');
  expect(typeof yaDisk.meta).toBe('object');
  expect(typeof yaDisk.meta.add).toBe('function');
  expect(typeof yaDisk.meta.get).toBe('function');
  expect(typeof yaDisk.operations).toBe('function');
  expect(typeof yaDisk.recent).toBe('function');
  expect(typeof yaDisk.upload).toBe('object');
  expect(typeof yaDisk.upload.link).toBe('function');
  expect(typeof yaDisk.upload.remoteFile).toBe('function');
  expect(typeof yaDisk.resources.create).toBe('function');
  expect(typeof yaDisk.resources.remove).toBe('function');
  expect(typeof yaDisk.resources.copy).toBe('function');
  expect(typeof yaDisk.resources.move).toBe('function');
});
