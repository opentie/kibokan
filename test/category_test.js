/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

const assert = require('power-assert');

const Category = require('../category');

describe('Category', () => {
  it('should construct object graph', () => {
    const category = new Category({ name: 'test' });

    let field1, field2, field3;
    const schema1 = category.createSchema({
      name: 'schema1',
      fields: [
        field1 = category.createField('TextField', {
          name: 'field1',
          description: null,
          isRequired: true,
          validators: [
            category.createValidator('MaxlengthValidator', {
              threshold: 10
            })
          ]
        }),
        field2 = category.createField('RadioField', {
          name: 'field2',
          description: null,
          isRequired: true,
          validators: [],
          options: [
            category.createOptionItem({
              label: 'option1',
              insertionFields: [
                field3 = category.createField('ParagraphField', {
                  name: 'field3',
                  description: null,
                  isRequired: true,
                  validators: []
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
      fields: [
        category.createField('RadioField', {
          name: 'field4',
          description: null,
          isRequired: true,
          validators: [],
          options: [
            category.createOptionItem({
              label: 'option2',
              insertionFields: [
                category.createField('ParagraphField', {
                  name: 'field5',
                  description: null,
                  isRequired: true,
                  validators: []
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
      fields: [
        category.createField('RadioField', {
          name: 'field6',
          description: null,
          isRequired: true,
          validators: [],
          options: [
            category.createOptionItem({
              label: 'option3',
              insertionFields: [
                category.createField('ParagraphField', {
                  name: 'field7',
                  description: null,
                  isRequired: true,
                  validators: []
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
    category.rootSchemaName = schema1.name;

    assert(category.resolve('schema1') === schema1);

    assert.deepEqual(
      schema1.retrieveAllPossibleFields(),
      [ field1, field2, field3 ]
    );

    assert.deepEqual(
      schema1.retrievePossibleAttachmentSchemata(),
      [ schema2, schema3 ]
    );

    assert.deepEqual(category.serialize(), {
      name: 'test',
      rootSchemaName: 'schema1',
      schemata: [
        {
          name: 'schema1',
          fields: [
            {
              $class: 'TextField',
              $properties: {
                name: 'field1',
                description: null,
                isRequired: true,
                validators: [
                  {
                    $class: 'MaxlengthValidator',
                    $properties: {
                      threshold: 10
                    },
                  }
                ]
              }
            },
            {
              $class: 'RadioField',
              $properties: {
                name: 'field2',
                description: null,
                isRequired: true,
                validators: [],
                options: [
                  {
                    label: 'option1',
                    insertionFields: [
                      {
                        $class: 'ParagraphField',
                        $properties: {
                          name: 'field3',
                          description: null,
                          isRequired: true,
                          validators: []
                        }
                      }
                    ],
                    attachmentNames: ['schema2'],
                    deadline: null
                  }
                ]
              }
            }
          ]
        },
        {
          name: 'schema2',
          fields: [
            {
              $class: 'RadioField',
              $properties: {
                name: 'field4',
                description: null,
                isRequired: true,
                validators: [],
                options: [
                  {
                    label: 'option2',
                    insertionFields: [
                      {
                        $class: 'ParagraphField',
                        $properties: {
                          name: 'field5',
                          description: null,
                          isRequired: true,
                          validators: []
                        }
                      }
                    ],
                    attachmentNames: ['schema3'],
                    deadline: null
                  }
                ]
              }
            }
          ]
        },
        {
          name: 'schema3',
          fields: [
            {
              $class: 'RadioField',
              $properties: {
                name: 'field6',
                description: null,
                isRequired: true,
                validators: [],
                options: [
                  {
                    label: 'option3',
                    insertionFields: [
                      {
                        $class: 'ParagraphField',
                        $properties: {
                          name: 'field7',
                          description: null,
                          isRequired: true,
                          validators: []
                        }
                      }
                    ],
                    attachmentNames: [],
                    deadline: null
                  }
                ]
              }
            }
          ]
        }
      ],
      referenceSchemata: [],
    });
  });
});

