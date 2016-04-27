const {
  StringSanitizer,
} = require('../sanitizers');

const BaseValidator = require('./base_validator');

class StringValidator extends BaseValidator {
  static get sanitizer() {
    return StringSanitizer;
  }
}

module.exports = StringValidator;
