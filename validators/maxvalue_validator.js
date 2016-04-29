'use strict';

const { identical } = require('../mappers');

const NumericValidator = require('./numeric_validator');

class MaxvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) <= this.threshold);
  }
}
MaxvalueValidator.property('threshold', identical);

module.exports = MaxvalueValidator;
