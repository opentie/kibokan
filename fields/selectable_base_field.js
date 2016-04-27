'use strict';

const assert = require('assert');

const NamedObjectMap = require('../named_object_map');

const OptionItem = require('../option_item');

const {
  OptionSanitizer,
} = require('../sanitizers');

const BaseField = require('./base_field');

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
    assert(typeof optionItem !== 'undefined');

    return optionItem.insertionFields;
  }

  retrievePossibleInsertionFields() {
    const fields = this.options.
            map(option => option.insertionFields);

    return Array.prototype.concat.apply([], fields);
  }
}
SelectableBaseField.property('options', [], [OptionItem]);

module.exports = SelectableBaseField;
