'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const FieldTypesMap = require('./field_types_map');

const staticize = require('./staticize').bind(null, 'serializationFormat');

class FieldSchema {
  static get serializationFormat() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        name: {
          schema: new StringSchema(),
        },
        type: {
          schema: new StringSchema(),
        },
        description: {
          required: false,
          schema: new StringSchema(),
          default: '',
        },
        required: {
          required: false,
          default: false,
          schema: new BooleanSchema(),
        },
        parameters: {
          required: false,
          default: {}
        }
      }
    });
  }

  constructor(name, description, required, type) {
    this.name = name;
    this.description = description;
    this.required = required;
    this.type = type;

    Object.freeze(this);
  }

  static deserialize(serializedField) {
    const normalizedField = this.serializationFormat.normalize(serializedField);

    const { name, description, required, parameters } = normalizedField;

    const typeName = normalizedField.type;
    const FieldType = FieldTypesMap.get(typeName);
    assert(typeof FieldType !== 'undefined', `no such FieldType ${typeName}`);
    const type = FieldType.deserialize(parameters);

    const instance = new this(name, description, required, type);

    return instance;
  }

  retrievePossibleInsertionFields(category) {
    return this.type.retrievePossibleInsertionFields(category);
  }

  retrievePossibleAttachmentSchemata(category) {
    return this.type.retrievePossibleAttachmentSchemata(category);
  }
}
staticize(FieldSchema);

module.exports = FieldSchema;
