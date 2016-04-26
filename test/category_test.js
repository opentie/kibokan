/* eslint-env mocha */

'use strict';

const assert = require('power-assert');

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

    assert(category.resolve('form1') === form1);

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
    assert(category.rootFormName === 'form1');
    assert(category.forms.length === 3);
    assert(category.forms[0].name === 'form1');
  });
});

