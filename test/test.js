const assert = require('power-assert');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const fixturesYaml = fs.readFileSync(path.join(__dirname, './fixtures.yml'));
const definitions = [];
yaml.safeLoadAll(fixturesYaml, (doc) => definitions.push(doc));

const { Namespace } = require('../');

describe('Namespave', () => {
  it('should construct namespace including Schema, RootSchema, SubSchemata', () => {
    const ns = new Namespace();
    assert(ns.Schema     !== undefined);
    assert(ns.SubSchema  !== undefined);
    assert(ns.RootSchema !== undefined);
  });
});
