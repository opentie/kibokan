/* eslint-env mocha */

'use strict';

const assert = require('assert');

const categoryFixture = require('./fixtures/category_fixture');

const Entity = require('../entity');
const Category = require('../category');
const FormValue = require('../form_value');

describe('Entity', () => {
  it('should update forms', () => {
    const { category, form1, form3 } = categoryFixture();
    const entity = new Entity();
    entity.category = category;
    entity.document = {};

    assert.deepEqual(
      [...entity.retrieveAttachableFormsMap().keys()],
      ['form1', 'form2']
    );

    assert.deepEqual(
      entity.update({
        form1: {
          field1: 'hey',
          field2: 'option1',
          field3: 'foobar',
        }
      }),
      [ form1 ]
    );

    assert.deepEqual(entity.document, {
      'form1': {
        field1: 'hey',
        field2: 'option1',
        field3: 'foobar',
      }
    });

    assert.deepEqual(
      [...entity.retrieveAttachableFormsMap().keys()],
      ['form1', 'form2', 'form3']
    );

    assert.deepEqual(
      entity.update({
        form1: {
          field1: 'hey',
          field2: 'option1',
          field3: 'foobar',
        },
        form3: {
          field6: 'option3',
          field7: 'heheyhey',
        }
      }),
      [ form1, form3 ]
    );

    assert.deepEqual(
      entity.update({
        form1: {
          field1: 'boo',
          field2: 'option1',
          field3: 'foobar',
        },
        form3: {
          field6: 'option3',
          field7: 'heheyhey',
        }
      }),
      [ form1 ]
    );
  });

  it('should be serizlized', () => {
    const { category, form1, form3 } = categoryFixture();
    const entity = new Entity();
    entity.category = category;
    entity.document = {};
    entity.metadata = {};

    assert.deepEqual(entity.serialize(), {
      $version: 0,
      metadata: {},
      category_name: 'test',
      document: {}
    });

    assert.deepEqual(entity.serialize({category: {}}), {
      $version: 0,
      metadata: {},
      category: category.serialize(),
      document: {}
    });
  });

  it('should be deserialized', () => {
    const { category, form1, form3 } = categoryFixture();
    const entity = new Entity();
    entity.category = category;
    entity.document = {};
    entity.metadata = {};

    Category.resolve = (primaryKey) => {
      return new Promise((resolve, reject) => {
        if (category.name === primaryKey) {
          return resolve(category);
        }

        return reject(new Error('no such category'));
      });
    };

    const entity2 = new Entity();
    return entity2.deserialize(entity.serialize({category: {}})).
      resolveReferences().then(() => {
        assert(entity.category.name === entity2.category.name);
      });
  });
});
