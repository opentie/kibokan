'use strict';

function generate() {
  return {
    $version: 0,
    metadata: {},
    namespace: 'ns',
    name: 'test',
    forms: [
      {
        $version: 0,
        metadata: {},
        name: 'form1',
        deadline: null,
        release: null,
        attachable: {},
        is_required: true,
        fields: [
          {
            $class: 'TextField',
            $properties: {
              $version: 0,
              metadata: {},
              name: 'field1',
              description: null,
              is_required: true,
              validators: [
                {
                  $class: 'MaxlengthValidator',
                  $properties: {
                    $version: 0,
                    metadata: {},
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
              metadata: {},
              name: 'field2',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  metadata: {},
                  label: 'option1',
                  insertion_fields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
                        metadata: {},
                        name: 'field3',
                        description: null,
                        is_required: true,
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
        metadata: {},
        name: 'form2',
        deadline: null,
        release: null,
        attachable: {},
        is_required: true,
        fields: [
          {
            $class: 'RadioField',
            $properties: {
              $version: 0,
              metadata: {},
              name: 'field4',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  metadata: {},
                  label: 'option2',
                  insertion_fields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
                        metadata: {},
                        name: 'field5',
                        description: null,
                        is_required: true,
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
        metadata: {},
        name: 'form3',
        deadline: null,
        release: null,
        attachable: { 'form1.field1': 'hey' },
        is_required: false,
        fields: [
          {
            $class: 'RadioField',
            $properties: {
              $version: 0,
              metadata: {},
              name: 'field6',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  $version: 0,
                  metadata: {},
                  label: 'option3',
                  insertion_fields: [
                    {
                      $class: 'ParagraphField',
                      $properties: {
                        $version: 0,
                        metadata: {},
                        name: 'field7',
                        description: null,
                        is_required: true,
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
