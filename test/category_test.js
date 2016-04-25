/* eslint-env mocha */
/* eslint no-sync: "off" */

'use strict';

const assert = require('power-assert');

const Category = require('../category');

describe('Category', () => {
  it('should construct object graph', () => {
    const category = new Category({ name: 'test' });

    let field1, field2, field3;
    const form1 = category.createForm({
      name: 'form1',
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
              attachmentNames: ['form2'],
              deadline: null
            })
          ]
        })
      ]
    });

    const form2 = category.createForm({
      name: 'form2',
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
              attachmentNames: ['form3'],
              deadline: null
            })
          ]
        })
      ]
    });

    const form3 = category.createForm({
      name: 'form3',
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

    category.forms = [form1, form2, form3];
    category.rootFormName = form1.name;

    assert(category.resolve('form1') === form1);

    assert.deepEqual(
      form1.retrieveAllPossibleFields(),
      [ field1, field2, field3 ]
    );

    assert.deepEqual(
      form1.retrievePossibleAttachmentForms(),
      [ form2, form3 ]
    );

    const serialized = {
      name: 'test',
      rootFormName: 'form1',
      forms: [
        {
          name: 'form1',
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
                    attachmentNames: ['form2'],
                    deadline: null
                  }
                ]
              }
            }
          ]
        },
        {
          name: 'form2',
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
                    attachmentNames: ['form3'],
                    deadline: null
                  }
                ]
              }
            }
          ]
        },
        {
          name: 'form3',
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
      referenceForms: [],
    };

    assert.deepEqual(category.serialize(), serialized);

    const category2 = new Category();
    category2.deserialize(serialized);
    assert(category2.name === 'test');
    assert(category2.rootFormName === 'form1');
    assert(category2.forms.length === 3);
    assert(category2.forms[0].name === 'form1');
  });
});

