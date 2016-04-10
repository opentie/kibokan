'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const FieldTypesMap = require('./field_types_map');

class FieldSchema {
  static get optionSchema() {
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

  constructor(option, context) {
    this.option = this.constructor.optionSchema.normalize(option);

    this.name = this.option.name;
    this.description = this.option.description;
    this.required = this.option.required;

    this.context = context;

    this.constructType(this.option.type, this.option.parameters);
  }

  constructType(type, parameters) {
    if (!FieldTypesMap.has(type)) {
      throw new TypeError(`No such field type: ${type}`);
    }
    const FieldType = FieldTypesMap.get(type);
    this.type = new FieldType(parameters, this.context);
  }

  retrievePossibleInsertionFields() {
    return this.type.retrievePossibleInsertionFields();
  }

  retrievePossibleAttachmentSchemata() {
    return this.type.retrievePossibleAttachmentSchemata();
  }
}

module.exports = FieldSchema;
