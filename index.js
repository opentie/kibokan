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

  constructor(option, context) {
    this.option = this.constructor.optionSchema.normalize(option);

    this.name = this.option.name;
    this.fieldSchemata = new Map();

    this.context = context;

    this.constructFieldSchemata(this.option.fields);
  }

  addFieldSchema(fieldSchema) {
    this.fieldSchemata.set(fieldSchema.name, fieldSchema);
  }

  constructFieldSchemata(fieldsOption) {
    for (let key of Object.keys(fieldsOption)) {
      const fieldOption = fieldsOption[key];

      const fieldSchema = new FieldSchema(fieldOption, this.context);
      this.addFieldSchema(fieldSchema);
    }
  }

  retrieveAllPossibleFields() {
    const fieldSchemata =
            [...this.fieldSchemata.values()].map((fieldSchema) => {
              return [fieldSchema].concat(
                fieldSchema.retrievePossibleInsertionFields());
            });

    return Array.prototype.concat.apply([], fieldSchemata);
  }

  retrievePossibleAttachmentSchemata() {
    const schemata = [...this.fieldSchemata.values()].map((fieldSchema) => {
      return fieldSchema.retrievePossibleAttachmentSchemata();
    });

    return Array.prototype.concat.apply([], schemata);
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
    return this.registerSubSchema(new SubSchema(option, this));
  }

  createRootSchema(option) {
    return this.registerRootSchema(new RootSchema(option, this));
  }

  registerSubSchema(subSchema) {
    assert(subSchema instanceof SubSchema);

    this.schemata.set(subSchema.name, subSchema);

    return subSchema;
  }

  registerRootSchema(rootSchema) {
    assert(rootSchema instanceof RootSchema);
    assert(this.rootSchema === null,
           'root schema is already registered');

    this.rootSchema = rootSchema;

    return rootSchema;
  }

  resolve(schemaName) {
    assert(this.schemata.has(schemaName),
           `no such schema: ${schemaName}`);

    return this.schemata.get(schemaName);
  }
}

module.exports = {
  Context,
  BaseSchema,
  RootSchema,
  SubSchema,
};
