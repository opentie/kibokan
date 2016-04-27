'use strict';

function generate() {
  return {
    name: 'test',
    rootFormName: 'form1',
    forms: [
      {
        name: 'form1',
        deadline: null,
        release: null,
        attachable: {},
        isRequired: true,
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
                  deadline: null
                }
              ]
            }
          }
        ]
      },
      {
        name: 'form2',
        deadline: null,
        release: null,
        attachable: {},
        isRequired: true,
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
                  deadline: null
                }
              ]
            }
          }
        ]
      },
      {
        name: 'form3',
        deadline: null,
        release: null,
        attachable: { 'form1.field1': 'hey' },
        isRequired: false,
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
                  deadline: null
                }
              ]
            }
          }
        ]
      }
    ],
  };
}

module.exports = generate;
