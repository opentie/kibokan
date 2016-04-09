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

const { Context } = require('../');

describe('RootSchema', () => {
  it('should register self with context', () => {
    const ns = new Context();
    const rootSchema = ns.createRootSchema(definitions[0]);
    assert(ns.rootSchema === rootSchema);
  });
});

describe('SubSchema', () => {
  it('should register self with context', () => {
    const ns = new Context();
    const schema = ns.createSubSchema(definitions[1]);
    assert(ns.rootSchema === null);
    assert(ns.schemata.get(schema.name) === schema);
  });
});
