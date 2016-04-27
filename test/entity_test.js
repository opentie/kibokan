/* eslint-env mocha */

'use strict';

const assert = require('assert');

const categoryFixture = require('./fixtures/category_fixture');
const Entity = require('../entity');
const FormValue = require('../form_value');

describe('Entity', () => {
  it('should', () => {
    const { category, form1 } = categoryFixture();
    const entity = new Entity(category, {});

    assert.deepEqual(
      [...entity.retrieveAttachableFormsMap().keys()],
      ['form1', 'form2']
    );

    const formValue = new FormValue(form1, {
      field1: 'hey',
      field2: 'option1',
      field3: 'foobar',
    });

    assert.deepEqual(entity.update(formValue), {
      isSuccessful: true,
      changes: [
        { type: 'addition', formName: 'form1' }
      ]
    });

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

    assert.deepEqual(entity.update(new FormValue(form1, {
      field1: 'foo',
      field2: 'option1',
      field3: 'foobar',
    })), {
      isSuccessful: true,
      changes: [
        { type: 'replacement', formName: 'form1' }
      ]
    });

    assert.deepEqual(entity.document, {
      'form1': {
        field1: 'foo',
        field2: 'option1',
        field3: 'foobar',
      }
    });

    assert.deepEqual(
      [...entity.retrieveAttachableFormsMap().keys()],
      ['form1', 'form2']
    );

    assert.deepEqual(entity.update(new FormValue(form1, {
      field1: 'foo',
      field2: 'option2',
      field3: 'foobar',
    })), {
      isSuccessful: false,
      changes: []
    });
  });
});
