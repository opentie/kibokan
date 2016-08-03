'use strict';

const Serializable = require('../serializable');
const { arrayOf, identical, polymorphic, categorized } = require('../mappers');

const Validators = require('../validators');

const FieldValue = require('../field_value');

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

  constructValue(rawValue) {
    return new FieldValue(this, rawValue);
  }
}
BaseField.property('name', identical);
BaseField.property('description', identical);
BaseField.property('isRequired', identical);
BaseField.property('validators', arrayOf(polymorphic(categorized, Validators)));

module.exports = BaseField;
