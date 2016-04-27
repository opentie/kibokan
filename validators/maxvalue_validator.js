'use strict';

const NumericValidator = require('./numeric_validator');

class MaxvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) <= this.threshold);
  }
}
MaxvalueValidator.property('threshold', 0);

module.exports = MaxvalueValidator;
