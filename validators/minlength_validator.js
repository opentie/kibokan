'use strict';

const { identical } = require('../mappers');

const StringValidator = require('./string_validator');

class MinlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length >= this.threshold);
  }
}
MinlengthValidator.property('threshold', identical);

module.exports = MinlengthValidator;
