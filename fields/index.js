'use strict';

const assert = require('assert');

const NamedObjectMap = require('../named_object_map');

const OptionItem = require('../option_item');

const {
  StringSanitizer,
  ListSanitizer,
} = require('../sanitizers');

const Fields = new NamedObjectMap();

function isCompatibleClass (expected, actual) {
  return (expected === actual ||
          actual.prototype instanceof expected);
}

class BaseField {
  constructor(category, { name, description, isRequired, validators }) {
    this.category = category;

    this.name = name;
    this.description = description;
    this.isRequired = isRequired;
    this.validators = validators;
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

class StringBaseField extends BaseField {
  static get sanitizer() {
    return StringSanitizer;
  }
}

class TextField extends StringBaseField {
}
Fields.add(TextField);

class ParagraphField extends StringBaseField {
}
Fields.add(ParagraphField);

class SelectableBaseField extends BaseField {
  constructor(category, parameter) {
    super(category, parameter);

    this.options = parameter.options;
  }

  retrievePossibleInsertionFields() {
    const fields = this.options.map((option) => {
      return option.insertionFields;
    });

    return Array.prototype.concat.apply([], fields);
  }

  retrievePossibleAttachmentSchemata() {
    const resolve = this.category.resolve.bind(this.category);
    const attachments = this.options.map((option) => {
      return option.retrievePossibleAttachmentSchemata();
    });

    return Array.prototype.concat.apply([], attachments);
  }
}

class RadioField extends SelectableBaseField {
}
Fields.add(RadioField);

module.exports = Object.assign(Fields, {
  BaseField,
  StringBaseField,
  SelectableBaseField,

  TextField,
  ParagraphField,
  RadioField,
});
