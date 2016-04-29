'use strict';

const { identical } = require('../mappers');

const StringValidator = require('./string_validator');

class MaxlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length <= this.threshold);
  }
}
MaxlengthValidator.property('threshold', identical);

module.exports = MaxlengthValidator;
