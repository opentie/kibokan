/* eslint-env mocha */

'use strict';

const assert = require('assert');
const categoryFixture = require('./fixtures/category_fixture');
const serializedCategoryFixture =
        require('./fixtures/serialized_category_fixture');
const Category = require('../category');
const FormValue = require('../form_value');

describe('FormValue', () => {
  it('should construct form value', () => {
    const {
      category,
      form1, form2, form3,
      field1, field2, field3,
    } = categoryFixture();

    new FormValue(form1, {});
  });
});

