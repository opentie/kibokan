/* eslint-env mocha */

'use strict';

const assert = require('assert');
const fs = require('fs');
const yaml = require('js-yaml');
const categoryFixture = require('./fixtures/category_fixture');
const serializedCategoryFixture =
        require('./fixtures/serialized_category_fixture');
const Category = require('../category');

describe('Category', () => {
  it('should construct object graph', () => {
    const {
      category,
      form1, form2, form3,
      field1, field2, field3,
    } = categoryFixture();

    assert(category.getFormByName('form1') === form1);

    assert.deepEqual(
      form1.retrieveAllPossibleFields(),
      [ field1, field2, field3 ]
    );
  });

  it('should serialize object graph', () => {
    const { category } = categoryFixture();
    const serialized = serializedCategoryFixture();

    assert.deepEqual(category.serialize(), serialized);
  });

  it('should deserialize object graph', () => {
    const serialized = serializedCategoryFixture();

    const category = new Category();
    category.deserialize(serialized);
    assert(category.name === 'test');
    assert(category.forms.length === 3);
    assert(category.forms[0].name === 'form1');
  });

  it('should deserialize and serialize', () => {
    const s = yaml.safeLoad(fs.readFileSync('./test/fixtures/category.yml'));
    const s2 = new Category().deserialize(s).serialize();
    assert.deepEqual(s, s2);
  });
});

