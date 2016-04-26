'use strict';

const assert = require('assert');

const Serializable = require('../serializable');
const NamedObjectMap = require('../named_object_map');

const Validators = require('../validators');
const OptionItem = require('../option_item');

const {
  StringSanitizer,
  ListSanitizer,
  OptionSanitizer,
} = require('../sanitizers');

const Fields = new NamedObjectMap();

function isCompatibleClass (expected, actual) {
  return (expected === actual ||
          actual.prototype instanceof expected);
}

class BaseField extends Serializable {
  get sanitizer() {
    throw new Error('not implemented');
  }

  retrieveInsertionFields(input) {
    return [];
  }

  retrievePossibleInsertionFields() {
    return [];
  }
}
BaseField.property('name', '');
BaseField.property('description', '');
BaseField.property('isRequired', false);
BaseField.property('validators', [], [Validators]);

class StringBaseField extends BaseField {
  get sanitizer() {
    return new StringSanitizer();
  }
}

class TextField extends StringBaseField {
}
Fields.add(TextField);

class ParagraphField extends StringBaseField {
}
Fields.add(ParagraphField);

class SelectableBaseField extends BaseField {
  get sanitizer() {
    return new OptionSanitizer(this.options.map(option => option.label));
  }

  set options(options) {
    this.optionsMap = NamedObjectMap.fromArray(options);
  }

  get options() {
    return [...this.optionsMap.values()];
  }

  retrieveInsertionFields(input) {
    if (this.sanitizer.isZero(input)) {
      return [];
    }

    const optionItem = this.optionsMap.get(input);
    assert(optionItem !== undefined);

    return optionItem.insertionFields;
  }

  retrievePossibleInsertionFields() {
    const fields = this.options.map((option) => {
      return option.insertionFields;
    });

    return Array.prototype.concat.apply([], fields);
  }
}
SelectableBaseField.property('options', [], [OptionItem]);

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
