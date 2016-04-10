'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  StringSchema,
} = require('./lowlevel');

const Field = require('./field');

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
    this.fields = new Map();

    this.context = context;

    this.constructFields(this.option.fields);
  }

  addField(field) {
    this.fields.set(field.name, field);
  }

  constructFields(fieldOptions) {
    for (let key of Object.keys(fieldOptions)) {
      const fieldOption = fieldOptions[key];

      const field = new Field(fieldOption, this.context);
      this.addField(field);
    }
  }

  retrieveAllPossibleFields() {
    const fields =
            [...this.fields.values()].map((field) => {
              return [field].concat(
                field.retrievePossibleInsertionFields());
            });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata() {
    const schemata = [...this.fields.values()].map((field) => {
      return field.retrievePossibleAttachmentSchemata();
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
