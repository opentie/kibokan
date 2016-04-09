'use strict';

let assert = require('assert');
if (process.env.NODE_ENV === 'test') {
  assert = require('power-assert'); // eslint-disable-line global-require
}

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

const {
  BaseValidator,
  RequiredValidator,
  MaxlengthValidator,
  MinlengthValidator,
} = require('./validators');

const FieldTypesMap = new Map();

class BaseFieldType {
  static get optionSchema() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        validations: {
          required: false,
          default: [],
          schema: new ArraySchema({
            itemSchema: new ObjectSchema({
              extraProperties: false,
              properties: {
                type: {
                  required: true,
                  schema: new StringSchema(),
                },
                parameter: {
                  required: false,
                  default: null,
                }
              }
            })
          }),
        }
      }
    });
  }

  static get validators() {
    return {};
  }

  validate(input) {
    return this.validators.filter((validator) => !validator.validate(input));
  }

  constructor(option) {
    // this is an abstract class
    if (this.constructor === BaseFieldType) {
      throw new TypeError('Illigal constructor');
    }
    this.option = this.constructor.optionSchema.normalize(option);

    const validators = this.constructor.validators;
    this.validators = this.option.validations.map(({ type, parameter }) => {
      if (!Object.hasOwnProperty.call(validators, type)) {
        throw new TypeError(`No such validator: ${type}`);
      }
      const Validator = validators[type];

      return new Validator(parameter);
    });
  }
}

class StringBaseFieldType extends BaseFieldType {
  static get validators() {
    return Object.assign(super.validators, {
      maxlength: MaxlengthValidator,
      minlength: MinlengthValidator,
    });
  }
}

class TextFieldType extends StringBaseFieldType {
}
FieldTypesMap.set('text', TextFieldType);

class ParagraphFieldType extends StringBaseFieldType {
  static get validators() {
    return Object.assign(super.validators, {
      maxlength: MaxlengthValidator,
      minlength: MinlengthValidator,
    });
  }
}
FieldTypesMap.set('paragraph', ParagraphFieldType);

class SelectableBaseFieldType {
  static get optionSchema() {
    return super.optionSchema.merge(
      new ObjectSchema({
        extraProperties: false,
        properties: {
          options: {
            required: true,
            schema: new ArraySchema({
              itemSchema: new ObjectSchema({
                extraProperties: false,
                properties: {
                  label: {
                    required: true,
                    schema: new StringSchema(),
                  },
                  inserts: {
                    required: false,
                    schema: new ArraySchema({
                      itemSchema: new StringSchema()
                    })
                  },
                  attaches: {
                    required: false,
                    schema: new ArraySchema({
                      itemSchema: new StringSchema()
                    })
                  }
                }
              })
            }),
          }
        }
      })
    );
  }
}

class RadioFieldType extends SelectableBaseFieldType {
}
FieldTypesMap.set('radio', RadioFieldType);

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

class SchemaBase {
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

class RootSchema extends SchemaBase {
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

class SubSchema extends SchemaBase {

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
  SchemaBase,
  RootSchema,
  SubSchema,
};
