'use strict';

function generate() {
  return {
    $version: 0,
    name: 'test',
    forms: [
      {
        $version: 0,
        name: 'form1',
        deadline: null,
        release: null,
        attachable: {},
        isRequired: true,
        fields: [
          {
            $class: 'TextField',
            $properties: {
              $version: 0,
              name: 'field1',
              description: null,
              isRequired: true,
              validators: [
                {
                  $class: 'MaxlengthValidator',
                  $properties: {
                    $version: 0,
                    threshold: 10
                  },
                }
              ]
            }
          },
          {
            $class: 'RadioField',
            $properties: {
              $version: 0,
              name: 'field2',
              description: null,
              isRequired: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  label: 'option1',
                  insertionFields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
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
        $version: 0,
        name: 'form2',
        deadline: null,
        release: null,
        attachable: {},
        isRequired: true,
        fields: [
          {
            $class: 'RadioField',
            $properties: {
              $version: 0,
              name: 'field4',
              description: null,
              isRequired: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  label: 'option2',
                  insertionFields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
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
        $version: 0,
        name: 'form3',
        deadline: null,
        release: null,
        attachable: { 'form1.field1': 'hey' },
        isRequired: false,
        fields: [
          {
            $class: 'RadioField',
            $properties: {
              $version: 0,
              name: 'field6',
              description: null,
              isRequired: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  label: 'option3',
                  insertionFields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
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
