/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

const assert = require('power-assert');

const Category = require('../category');

describe('Category', () => {
  it('should construct object graph', () => {
    const category = new Category('test');

    let field1, field2, field3;
    const schema1 = category.createSchema({
      name: 'schema1',
      deadline: null,
      fields: [
        field1 = category.createField('TextField', {
          name: 'field1',
          description: null,
          isRequired: true,
          validators: [
            category.createValidator('MaxlengthValidator', 10)
          ]
        }),
        field2 = category.createField('RadioField', {
          name: 'field2',
          description: null,
          isRequired: true,
          validations: [],
          options: [
            category.createOptionItem({
              label: 'option1',
              insertionFields: [
                field3 = category.createField('ParagraphField', {
                  name: 'field3',
                  description: null,
                  isRequired: true,
                  validations: []
                })
              ],
              attachmentNames: ['schema2'],
              deadline: null
            })
          ]
        })
      ]
    });

    const schema2 = category.createSchema({
      name: 'schema2',
      deadline: null,
      fields: [
        category.createField('RadioField', {
          name: 'field4',
          description: null,
          isRequired: true,
          validations: [],
          options: [
            category.createOptionItem({
              label: 'option2',
              insertionFields: [
                category.createField('ParagraphField', {
                  name: 'field5',
                  description: null,
                  isRequired: true,
                  validations: []
                })
              ],
              attachmentNames: ['schema3'],
              deadline: null
            })
          ]
        })
      ]
    });

    const schema3 = category.createSchema({
      name: 'schema3',
      deadline: null,
      fields: [
        category.createField('RadioField', {
          name: 'field6',
          description: null,
          isRequired: true,
          validations: [],
          options: [
            category.createOptionItem({
              label: 'option3',
              insertionFields: [
                category.createField('ParagraphField', {
                  name: 'field7',
                  description: null,
                  isRequired: true,
                  validations: []
                })
              ],
              attachmentNames: [],
              deadline: null
            })
          ]
        })
      ]
    });

    category.schemata = [schema1, schema2, schema3];

    assert(category.resolve('schema1') === schema1);

    assert.deepEqual(
      schema1.retrieveAllPossibleFields(),
      [ field1, field2, field3 ]
    );

    assert.deepEqual(
      schema1.retrievePossibleAttachmentSchemata(),
      [ schema2, schema3 ]
    );
  });
});

