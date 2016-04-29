'use strict';

const Category = require('../../category');

function generate() {
  const category = new Category();
  category.name = 'test';
  category.namespace = 'ns';
  category.metadata = {};

  /* eslint-disable init-declarations */

  let field1, field2, field3;

  /* eslint-enable init-declarations */

  const form1 = category.createForm({
    metadata: {},
    name: 'form1',
    deadline: null,
    release: null,
    isRequired: true,
    attachable: {},
    fields: [
      field1 = category.createField('TextField', {
        metadata: {},
        name: 'field1',
        description: null,
        isRequired: true,
        validators: [
          category.createValidator('MaxlengthValidator', {
            metadata: {},
            threshold: 10
          })
        ]
      }),
      field2 = category.createField('RadioField', {
        metadata: {},
        name: 'field2',
        description: null,
        isRequired: true,
        validators: [],
        options: [
          category.createOptionItem({
            metadata: {},
            label: 'option1',
            insertionFields: [
              field3 = category.createField('ParagraphField', {
                metadata: {},
                name: 'field3',
                description: null,
                isRequired: true,
                validators: []
              })
            ],
            deadline: null
          })
        ]
      })
    ]
  });

  const form2 = category.createForm({
    metadata: {},
    name: 'form2',
    deadline: null,
    release: null,
    isRequired: true,
    attachable: {},
    fields: [
      category.createField('RadioField', {
        metadata: {},
        name: 'field4',
        description: null,
        isRequired: true,
        validators: [],
        options: [
          category.createOptionItem({
            metadata: {},
            label: 'option2',
            insertionFields: [
              category.createField('ParagraphField', {
                metadata: {},
                name: 'field5',
                description: null,
                isRequired: true,
                validators: []
              })
            ],
            deadline: null
          })
        ]
      })
    ]
  });

  const form3 = category.createForm({
    metadata: {},
    name: 'form3',
    deadline: null,
    release: null,
    isRequired: false,
    attachable: { 'form1.field1': 'hey' },
    fields: [
      category.createField('RadioField', {
        metadata: {},
        name: 'field6',
        description: null,
        isRequired: true,
        validators: [],
        options: [
          category.createOptionItem({
            metadata: {},
            label: 'option3',
            insertionFields: [
              category.createField('ParagraphField', {
                metadata: {},
                name: 'field7',
                description: null,
                isRequired: true,
                validators: []
              })
            ],
            deadline: null
          })
        ]
      })
    ]
  });

  category.forms = [form1, form2, form3];

  return {
    category,
    form1, form2, form3,
    field1, field2, field3,
  };
}

module.exports = generate;
