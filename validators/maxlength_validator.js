'use strict';

const StringValidator = require('./string_validator');

class MaxlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length <= this.threshold);
  }
}
MaxlengthValidator.property('threshold', 0);

module.exports = MaxlengthValidator;
