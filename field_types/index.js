'use strict';

const assert = require('assert');

const staticize = require('../staticize').bind(null, 'serializationFormat');

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

const Field = require('../field');

function isCompatibleClass (expected, actual) {
  return (expected === actual ||
          actual.prototype instanceof expected);
}

class BaseFieldType {
  static get typeName() {
    throw new Error('not implemented');
  }

  static get serializationFormat() {
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

  constructor(validations) {
    // this is an abstract class
    assert(this.constructor !== BaseFieldType, 'Illigal constructor');

    this.validations = validations;
  }

  static deserialize() {
    throw new Error('Not implemented');
  }

  serialize() {
    throw new Error('Not implemented');
  }

  static deserializeValidations(validations) {
    const { validators, sanitizer } = this;

    return validations.map(({ type, parameter }) => {
      assert(Object.hasOwnProperty.call(validators, type),
             `No such validator: ${type}`);

      const Validator = validators[type];
      assert(isCompatibleClass(Validator.sanitizer, sanitizer),
             `Not compatible validator: ${type}`);

      return new Validator(parameter);
    });
  }

  validate(input) {
    return this.validations.filter((validator) => !validator.validate(input));
  }

  retrievePossibleInsertionFields() {
    return [];
  }

  retrievePossibleAttachmentSchemata() {
    return [];
  }
}
staticize(BaseFieldType);

class StringBaseFieldType extends BaseFieldType {
  static get validators() {
    return Object.assign(super.validators, {
      maxlength: MaxlengthValidator,
      minlength: MinlengthValidator,
    });
  }

  constructor(validations) {
    super(validations);

    Object.freeze(this);
  }

  static get sanitizer() {
    return StringSanitizer;
  }

  static deserialize(serializedTypeParameters) {
    const normalizedTypeParameters =
            this.serializationFormat.normalize(serializedTypeParameters);

    const validations =
            this.deserializeValidations(normalizedTypeParameters.validations);

    const instance = new this(validations);

    return instance;
  }
}
staticize(StringBaseFieldType);

class TextFieldType extends StringBaseFieldType {
  static get typeName() {
    return 'text';
  }
}
staticize(TextFieldType);
FieldTypesMap.register(TextFieldType);

class ParagraphFieldType extends StringBaseFieldType {
  static get typeName() {
    return 'paragraph';
  }
}
staticize(ParagraphFieldType);
FieldTypesMap.register(ParagraphFieldType);

class OptionItem {
  static get serializationFormat() {
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

  constructor(label, insertionFields, attachmentNames, deadline) {
    this.label = label;
    this.insertionFields = insertionFields;
    this.attachmentNames = attachmentNames;
    this.deadline = deadline;
    this.isDeadlineSet = (this.deadline !== null);

    Object.freeze(this);
  }

  static deserialize(serializedOption) {
    const normalizedOption =
            this.serializationFormat.normalize(serializedOption);

    const { label, attachmentNames } = normalizedOption;

    const serializedInsertionFields = normalizedOption.insertionFields;
    const insertionFields = serializedInsertionFields.
            map(Field.deserialize.bind(Field));

    const deadline = (normalizedOption.deadline !== null)
            ? new Date(normalizedOption.deadline)
            : null;

    const instance = new this(label, insertionFields, attachmentNames, deadline);

    return instance;
  }

  serialize() {
    // TODO:
  }

  retrievePossibleAttachmentSchemata(category) {
    const resolve = category.resolve.bind(category);
    const attachments = this.attachmentNames.map(resolve).map((schema) => {
      return [schema].concat(schema.retrievePossibleAttachmentSchemata(category));
    });

    return Array.prototype.concat.apply([], attachments);
  }
}
staticize(OptionItem);

class SelectableBaseFieldType extends BaseFieldType {
  static get serializationFormat() {
    return super.serializationFormat.merge(
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

  constructor(validations, options) {
    super(validations);

    this.options = options;

    Object.freeze(this);
  }

  static deserialize(serializedTypeParameters) {
    const normalizedTypeParameters =
            this.serializationFormat.normalize(serializedTypeParameters);

    const validations =
            this.deserializeValidations(normalizedTypeParameters.validations);

    const options = normalizedTypeParameters.options.
            map(OptionItem.deserialize.bind(OptionItem));

    const instance = new this(validations, options);

    return instance;
  }

  retrievePossibleInsertionFields() {
    const fields = this.options.map((option) => {
      return option.insertionFields;
    });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata(category) {
    const resolve = category.resolve.bind(category);
    const attachments = this.options.map((option) => {
      return option.retrievePossibleAttachmentSchemata(category);
    });

    return Array.prototype.concat.apply([], attachments);
  }
}
staticize(SelectableBaseFieldType);

class RadioFieldType extends SelectableBaseFieldType {
  static get typeName() {
    return 'radio';
  }
}
staticize(RadioFieldType);
FieldTypesMap.register(RadioFieldType);

module.exports = {
  BaseFieldType,
  StringBaseFieldType,
  SelectableBaseFieldType,

  TextFieldType,
  ParagraphFieldType,
  RadioFieldType,
};
