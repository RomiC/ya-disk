import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import yaDisk from '../index.js';

describe('index', () => {
  test('it should export all methods', () => {
    assert.equal(typeof yaDisk.download, 'object');
    assert.equal(typeof yaDisk.download.link, 'function');
    assert.equal(typeof yaDisk.info, 'function');
    assert.equal(typeof yaDisk.list, 'function');
    assert.equal(typeof yaDisk.meta, 'object');
    assert.equal(typeof yaDisk.meta.add, 'function');
    assert.equal(typeof yaDisk.meta.get, 'function');
    assert.equal(typeof yaDisk.operations, 'function');
    assert.equal(typeof yaDisk.publicResources, 'object');
    assert.equal(typeof yaDisk.publicResources.get, 'function');
    assert.equal(typeof yaDisk.publicResources.download, 'function');
    assert.equal(typeof yaDisk.publicResources.saveToDisk, 'function');
    assert.equal(typeof yaDisk.publicResources.list, 'function');
    assert.equal(typeof yaDisk.recent, 'function');
    assert.equal(typeof yaDisk.trash, 'object');
    assert.equal(typeof yaDisk.trash.delete, 'function');
    assert.equal(typeof yaDisk.trash.restore, 'function');
    assert.equal(typeof yaDisk.upload, 'object');
    assert.equal(typeof yaDisk.upload.link, 'function');
    assert.equal(typeof yaDisk.upload.remoteFile, 'function');
    assert.equal(typeof yaDisk.resources.create, 'function');
    assert.equal(typeof yaDisk.resources.remove, 'function');
    assert.equal(typeof yaDisk.resources.copy, 'function');
    assert.equal(typeof yaDisk.resources.move, 'function');
    assert.equal(typeof yaDisk.resources.publish, 'function');
    assert.equal(typeof yaDisk.resources.unpublish, 'function');
  });
});
