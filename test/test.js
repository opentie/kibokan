const assert = require('power-assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const fixturesYaml = fs.readFileSync(path.join(__dirname, './fixtures.yml'));
const definitions = [];
yaml.safeLoadAll(fixturesYaml, (doc) => definitions.push(doc));

const { Namespace, RootSchemaBase, SubSchemaBase } = require('../');

describe('Namespace', () => {
  it('should construct namespace including RootSchema, SubSchemata', () => {
    const ns = new Namespace();
    assert(ns.SubSchema.prototype  instanceof SubSchemaBase);
    assert(ns.RootSchema.prototype instanceof RootSchemaBase);
  });
});
