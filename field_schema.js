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

  constructor(option) {
    this.option = this.constructor.optionSchema.normalize(option);

    this.name = this.option.name;
    this.description = this.option.description;
    this.required = this.option.required;
    if (!FieldTypesMap.has(this.option.type)) {
      throw new TypeError(`No such field type: ${this.option.type}`);
    }
    const FieldType = FieldTypesMap.get(this.option.type);
    this.type = new FieldType(this.option.parameters);
  }
}

module.exports = FieldSchema;
