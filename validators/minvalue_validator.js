'use strict';

const { identical } = require('../mappers');

const NumericValidator = require('./numeric_validator');

class MinvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.threshold);
  }
}
MinvalueValidator.property('threshold', identical);

module.exports = MinvalueValidator;
