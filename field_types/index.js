'use strict';

const assert = require('assert');

const {
  ObjectSchema,
  ArraySchema,
  StringSchema,
  NullableSchema,
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

const FieldSchema = require('../field_schema');

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

  constructor(option, context) {
    //if (context === undefined) { throw new Error(); }
    // this is an abstract class
    assert(this.constructor !== BaseFieldType, 'Illigal constructor');

    this.parameter = this.constructor.parameterSchema.normalize(option);
    this.validtors = [];

    this.context = context;

    this.constructValidators(this.parameter.validations);
  }

  constructValidators(validations) {
    const { validators, sanitizer } = this.constructor;
    this.validators = validations.map(({ type, parameter }) => {
      assert(Object.hasOwnProperty.call(validators, type),
             `No such validator: ${type}`);

      const Validator = validators[type];
      assert(isCompatibleClass(Validator.sanitizer, sanitizer),
             `Not compatible validator: ${type}`);

      return new Validator(parameter);
    });
  }

  validate(input) {
    return this.validators.filter((validator) => !validator.validate(input));
  }

  retrievePossibleInsertionFields() {
    return [];
  }

  retrievePossibleAttachmentSchemata() {
    return [];
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

class OptionItem {
  static get parametersSchema() {
    return new ObjectSchema({
      extraProperties: false,
      properties: {
        label: {
          required: true,
          schema: new StringSchema(),
        },
        insertionFields: {
          required: false,
          default: [],
          schema: new ArraySchema(),
        },
        attachmentNames: {
          required: false,
          default: [],
          schema: new ArraySchema({
            itemSchema: new StringSchema()
          })
        },
        deadline: {
          required: false,
          default: null,
          schema: new NullableSchema({
            schema: new StringSchema()
          })
        }
      }
    });
  }

  constructor(parameters, context) {
    this.parameters = this.constructor.parametersSchema.normalize(parameters);

    this.label = this.parameters.label;
    this.insertionFields = [];
    this.attachmentNames = this.parameters.attachmentNames;
    this.isDeadlineSet = (this.parameters.deadline !== null);
    this.deadline = null;
    if (this.isDeadlineSet) {
      this.deadline = new Date(this.parameters.deadline);
    }

    this.context = context;

    this.constructInsertionFields(this.parameters.insertionFields);
  }

  constructInsertionFields(insertionFieldOptionList) {
    this.insertionFields = insertionFieldOptionList.map((fieldOption) => {
      return new FieldSchema(fieldOption, this.context);
    });
  }

  retrievePossibleAttachmentSchemata() {
    const resolve = this.context.resolve.bind(this.context);
    const attachments = this.attachmentNames.map(resolve).map((schema) => {
      return [schema].concat(schema.retrievePossibleAttachmentSchemata());
    });

    return Array.prototype.concat.apply([], attachments);
  }
}

class SelectableBaseFieldType extends BaseFieldType {
  static get parameterSchema() {
    return super.parameterSchema.merge(
      new ObjectSchema({
        extraProperties: false,
        properties: {
          options: {
            required: true,
            schema: new ArraySchema(),
          }
        }
      })
    );
  }

  constructor(...args) {
    super(...args);
    this.options = [];

    this.constructOptions(this.parameter.options);
  }

  constructOptions(optionParametersList) {
    this.options = optionParametersList.map((optionParameters) => {
      const option = new OptionItem(optionParameters, this.context);

      return option;
    });
  }

  retrievePossibleInsertionFields() {
    const fields = this.options.map((option) => {
      return option.insertionFields;
    });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata() {
    const resolve = this.context.resolve.bind(this.context);
    const attachments = this.options.map((option) => {
      return option.retrievePossibleAttachmentSchemata();
    });

    return Array.prototype.concat.apply([], attachments);
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
