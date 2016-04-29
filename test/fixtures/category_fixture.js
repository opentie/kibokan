'use strict';

const Category = require('../../category');

function generate() {
  const category = new Category({ name: 'test' });

  /* eslint-disable init-declarations */

  let field1, field2, field3;

  /* eslint-enable init-declarations */

  const form1 = category.createForm({
    name: 'form1',
    isRequired: true,
    attachable: {},
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
            deadline: null
          })
        ]
      })
    ]
  });

  const form2 = category.createForm({
    name: 'form2',
    isRequired: true,
    attachable: {},
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
            deadline: null
          })
        ]
      })
    ]
  });

  const form3 = category.createForm({
    name: 'form3',
    isRequired: false,
    attachable: { 'form1.field1': 'hey' },
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
