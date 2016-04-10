'use strict';

const {
  ObjectSchema,
  ArraySchema,
  StringSchema,
} = require('../lowlevel');

const {
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
} = require('../validators');

const FieldTypesMap = require('../field_types_map');

const {
  StringSanitizer,
  ListSanitizer,
} = require('../sanitizers');

function isCompatibleClass (expected, actual) {
  return (expected === actual ||
          actual.prototype instanceof expected);
}

class BaseFieldType {
  static get parameterSchema() {
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
    this.parameter = this.constructor.parameterSchema.normalize(option);

    const { validators, sanitizer } = this.constructor;
    this.validators = this.parameter.validations.map(({ type, parameter }) => {
      if (!Object.hasOwnProperty.call(validators, type)) {
        throw new TypeError(`No such validator: ${type}`);
      }

      const Validator = validators[type];
      if (!isCompatibleClass(Validator.sanitizer, sanitizer)) {
        throw new TypeError(`Not compatible validator: ${type}`);
      }

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

  static get sanitizer() {
    return StringSanitizer;
  }
}

class TextFieldType extends StringBaseFieldType {
}
FieldTypesMap.set('text', TextFieldType);

class ParagraphFieldType extends StringBaseFieldType {
}
FieldTypesMap.set('paragraph', ParagraphFieldType);

class SelectableBaseFieldType extends BaseFieldType {
  static get parameterSchema() {
    return super.parameterSchema.merge(
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

module.exports = {
  BaseFieldType,
  StringBaseFieldType,
  SelectableBaseFieldType,

  TextFieldType,
  ParagraphFieldType,
  RadioFieldType,
};
