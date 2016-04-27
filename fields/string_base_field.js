const { StringSanitizer } = require('../sanitizers');

const BaseField = require('./base_field');

class StringBaseField extends BaseField {
  get sanitizer() {
    return new StringSanitizer();
  }
}

module.exports = StringBaseField;
