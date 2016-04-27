const NumericValidator = require('./numeric_validator');

class MinvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.threshold);
  }
}
MinvalueValidator.property('threshold', 0);

module.exports = MinvalueValidator;
