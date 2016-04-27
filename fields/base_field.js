const Serializable = require('../serializable');

const Validators = require('../validators');

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

module.exports = BaseField;
