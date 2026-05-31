import assert from 'node:assert/strict';

import yaDisk, {
  download,
  info,
  list,
  meta,
  operations,
  publicResources,
  recent,
  resources,
  trash,
  upload
} from 'ya-disk';

const expectedEntries = {
  download,
  info,
  list,
  meta,
  operations,
  publicResources,
  recent,
  resources,
  trash,
  upload
};

assert.deepStrictEqual(
  Object.keys(expectedEntries).sort(),
  Object.keys(yaDisk).sort()
);

for (const [key, value] of Object.entries(expectedEntries)) {
  assert.strictEqual(
    yaDisk[key],
    value,
    `Expected ${key} to match default export`
  );
}
