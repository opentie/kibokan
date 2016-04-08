/* eslint consistent-this: ["error", "namespace"] */

'use strict';

const assert = require('assert');

const {
  Validity,
  AbstractSchema,
  NoopSchema,
  ClassSchema,
  ObjectSchema,
  ArraySchema,
  BooleanSchema,
  NumberSchema,
  StringSchema,
  NullSchema,
  UndefinedSchema,
} = require('./lowlevel');

class AbstractFieldDefinition {
  static get optionSchema() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        name: {
          schema: new StringSchema()
        },
        type: {
          schema: new StringSchema()
        },
        description: {
          required: false,
          schema: new StringSchema(),
          default: null
        },
        validation: {
          required: false,
          default: {}
        }
      }
    });
  }

  constructor(option) {
    // this is an abstract class
    if (this.constructor === AbstractFieldDefinition) {
      throw new TypeError('Illigal constructor');
    }
    assert(this.validateOption(option));
  }

  normalizeOption() {

  }
}

class TextFieldDefinition extends AbstractFieldDefinition {
}

class SchemaBase {
  static get additionalOptions() {
    return {};
  }

  static get optionSchema() {
    return new ObjectSchema({
      extraProperties: false,
      properties: Object.assign({
        name: {
          schema: new StringSchema()
        },
        fields: {
          schema: new ArraySchema()
        }
      }, this.additionalOptions)
    });
  }

  constructor(option) {
    assert(this.constructor.optionSchema.validate(option).force());

    this.name = option;
  }
}

class RootSchemaBase extends SchemaBase {
  static get additionalOptions() {
    return {
      kind: {
        schema: new StringSchema()
      }
    };
  }
}

class SubSchemaBase extends SchemaBase {
  static get additionalOptions() {
    return {};
  }
}

class Namespace {
  constructor() {
    this.schemata = new Map();
    this.rootSchema = null;

    const namespace = this;
    this.RootSchema =
      class RootSchema extends RootSchemaBase {
        constructor(...args) {
          super(...args);
          this.namespace = namespace;
          this.namespace.registerRootSchema(this);
        }
      };
    this.SubSchema =
      class SubSchema extends SubSchemaBase {
        constructor(...args) {
          super(...args);
          this.namespace = namespace;
          this.namespace.register(this);
        }
      };
  }

  register(subSchema) {
    assert(subSchema instanceof this.SubSchema);
    this.schemata.set(subSchema.name, subSchema);
  }

  registerRootSchema(rootSchema) {
    if (this.rootSchema !== null) {
      throw new Error('root schema is already registered');
    }
    assert(rootSchema instanceof this.RootSchema);
    this.rootSchema = rootSchema;
  }
}

module.exports = {
  Namespace,
  SchemaBase,
  RootSchemaBase,
  SubSchemaBase
};
