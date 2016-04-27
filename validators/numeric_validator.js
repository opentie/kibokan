const StringValidator = require('./string_validator');

class NumericValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) &&
            !Number.isNaN(Number(input)));
  }
}

module.exports = NumericValidator;
