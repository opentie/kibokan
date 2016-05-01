'use strict';

const Category = require('../../category');
const { AndOperator, OrOperator, MatchOperator } = require('../../operators');
const { LiteralValueOperator } = require('../../operators/value_operators');

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
    isProtected: false,
    attachable: Object.assign(new OrOperator(), { operators: [] }),
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
    metadata: {},
    name: 'form2',
    deadline: null,
    release: null,
    isRequired: true,
    isProtected: false,
    attachable: Object.assign(new OrOperator(), { operators: [] }),
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
    metadata: {},
    name: 'form3',
    deadline: null,
    release: null,
    isRequired: false,
    isProtected: false,
    attachable: Object.assign(new OrOperator(), {
      operators: [
        Object.assign(new AndOperator(), {
          operators: [
            Object.assign(new MatchOperator(), {
              form: 'form1',
              field: 'field1',
              value: Object.assign(new LiteralValueOperator(), {
                value: 'hey'
              })
            })
          ]
        })
      ]
    }),
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
