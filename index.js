'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const FieldSchema = require('./field_schema');

class BaseSchema {
  static get optionSchema() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        name: {
          schema: new StringSchema()
        },
        fields: {
          schema: new ArraySchema()
        }
      }
    });
  }

  constructor(option) {
    this.option = this.constructor.optionSchema.normalize(option);

    this.name = this.option.name;
    this.fieldSchemata = this.constructFieldSchemata(this.option.fields);

    this.context = null;
  }

  constructFieldSchemata(fieldsOption) {
    const fieldSchemata = new Map();
    for (let key of Object.keys(fieldsOption)) {
      const fieldOption = fieldsOption[key];

      const fieldSchema = new FieldSchema(fieldOption);
      fieldSchemata.set(fieldSchemata.name, fieldSchema);
    }

    return fieldSchemata;
  }
}

class RootSchema extends BaseSchema {
  static get optionSchema() {
    return super.optionSchema.merge(
      new ObjectSchema({
        properties: {
          kind: {
            schema: new StringSchema()
          }
        }
      })
    );
  }
}

class SubSchema extends BaseSchema {

}

class Context {
  constructor() {
    this.schemata = new Map();
    this.rootSchema = null;
  }

  createSubSchema(option) {
    return this.registerSubSchema(new SubSchema(option));
  }

  createRootSchema(option) {
    return this.registerRootSchema(new RootSchema(option));
  }

  registerSubSchema(subSchema) {
    assert(subSchema instanceof SubSchema);

    subSchema.context = this;
    this.schemata.set(subSchema.name, subSchema);

    return subSchema;
  }

  registerRootSchema(rootSchema) {
    assert(rootSchema instanceof RootSchema);

    if (this.rootSchema !== null) {
      throw new Error('root schema is already registered');
    }

    rootSchema.context = this;
    this.rootSchema = rootSchema;

    return rootSchema;
  }
}

module.exports = {
  Context,
  BaseSchema,
  RootSchema,
  SubSchema,
};
