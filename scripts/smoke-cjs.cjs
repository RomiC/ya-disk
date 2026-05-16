const assert = require('node:assert/strict');

const yaDisk = require('ya-disk');

const expectedExports = [
  'download',
  'info',
  'list',
  'meta',
  'operations',
  'publicResources',
  'recent',
  'resources',
  'trash',
  'upload'
].sort();

const topLevel = { ...yaDisk };
delete topLevel.default;

assert.deepStrictEqual(Object.keys(topLevel).sort(), expectedExports);

for (const key of expectedExports) {
  assert.ok(topLevel[key], `Expected ${key} to be exported`);
}

if (yaDisk.default) {
  assert.deepStrictEqual(Object.keys(yaDisk.default).sort(), expectedExports);
}
