/* eslint-env mocha */

'use strict';

const assert = require('assert');

const categoryFixture = require('./fixtures/category_fixture');
const Entity = require('../entity');
const FormValue = require('../form_value');

describe('Entity', () => {
  it('should', () => {
    const { category, form1, form3 } = categoryFixture();
    const entity = new Entity(category, {});

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
});
