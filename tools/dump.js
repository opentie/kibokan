const fs = require('fs');
const yaml = require('js-yaml');
const Category = require('../category');
const assert = require('assert');

const s = yaml.safeLoad(fs.readFileSync('../test/fixtures/category.yml'));
const s2 = new Category().deserialize(s).serialize();
assert.deepEqual(s, s2);

console.log(
  JSON.stringify(s, null, 2)
);
