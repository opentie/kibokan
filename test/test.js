/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

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
    assert(ns.SubSchema.prototype instanceof SubSchemaBase);
    assert(ns.RootSchema.prototype instanceof RootSchemaBase);
  });
});

describe('RootSchema', () => {
  it('should register self with namespace', () => {
    const ns = new Namespace();
    const rootSchema = new ns.RootSchema(definitions[0]);
    assert(ns.rootSchema === rootSchema);
  });
});

describe('SubSchema', () => {
  it('should register self with namespace', () => {
    const ns = new Namespace();
    const schema = new ns.SubSchema(definitions[1]);
    assert(ns.rootSchema === null);
    assert(ns.schemata.get(schema.name) === schema);
  });
});
