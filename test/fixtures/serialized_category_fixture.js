'use strict';

function generate() {
  return {
    _version: 0,
    metadata: {},
    namespace: 'ns',
    name: 'test',
    forms: [
      {
        _version: 0,
        metadata: {},
        name: 'form1',
        deadline: null,
        release: null,
        attachable: {},
        is_required: true,
        fields: [
          {
            _class: 'TextField',
            _properties: {
              _version: 0,
              metadata: {},
              name: 'field1',
              description: null,
              is_required: true,
              validators: [
                {
                  _class: 'MaxlengthValidator',
                  _properties: {
                    _version: 0,
                    metadata: {},
                    threshold: 10
                  },
                }
              ]
            }
          },
          {
            _class: 'RadioField',
            _properties: {
              _version: 0,
              metadata: {},
              name: 'field2',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  metadata: {},
                  label: 'option1',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
        _version: 0,
        metadata: {},
        name: 'form2',
        deadline: null,
        release: null,
        attachable: {},
        is_required: true,
        fields: [
          {
            _class: 'RadioField',
            _properties: {
              _version: 0,
              metadata: {},
              name: 'field4',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  metadata: {},
                  label: 'option2',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
        _version: 0,
        metadata: {},
        name: 'form3',
        deadline: null,
        release: null,
        attachable: { 'form1.field1': 'hey' },
        is_required: false,
        fields: [
          {
            _class: 'RadioField',
            _properties: {
              _version: 0,
              metadata: {},
              name: 'field6',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  metadata: {},
                  label: 'option3',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
