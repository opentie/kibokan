'use strict';

function generate() {
  return {
    _version: 0,
    autoincrement: 0,
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
        attachable: { _version: 0, operators: [] },
        is_required: true,
        is_protected: false,
        fields: [
          {
            _class: 'TextField',
            _properties: {
              _version: 0,
              name: 'field1',
              description: null,
              is_required: true,
              validators: [
                {
                  _class: 'MaxlengthValidator',
                  _properties: {
                    _version: 0,
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
              name: 'field2',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  label: 'option1',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
          },
          {
            _class: 'TableField',
            _properties: {
              _version: 0,
              name: 'table1',
              description: null,
              is_required: false,
              validators: [],
              columns: [
                {
                  _class: 'TextField',
                  _properties: {
                    _version: 0,
                    name: 'column1',
                    description: null,
                    is_required: true,
                    validators: [
                      {
                        _class: 'MaxlengthValidator',
                        _properties: {
                          _version: 0,
                          threshold: 10
                        },
                      }
                    ]
                  }
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
        attachable: { _version: 0, operators: [] },
        is_required: true,
        is_protected: false,
        fields: [
          {
            _class: 'RadioField',
            _properties: {
              _version: 0,
              name: 'field4',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  label: 'option2',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
        attachable: {
          _version: 0,
          operators: [
            {
              _version: 0,
              operators: [
                {
                  _version: 0,
                  form: 'form1',
                  field: 'field1',
                  value: {
                    _class: 'LiteralValueOperator',
                    _properties: {
                      _version: 0,
                      value: 'hey'
                    }
                  }
                }
              ]
            }
          ]
        },
        is_required: false,
        is_protected: false,
        fields: [
          {
            _class: 'RadioField',
            _properties: {
              _version: 0,
              name: 'field6',
              description: null,
              is_required: true,
              validators: [],
              options: [
                {
                  _version: 0,
                  label: 'option3',
                  insertion_fields: [
                    {
                      _class: 'ParagraphField',
                      _properties: {
                        _version: 0,
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
