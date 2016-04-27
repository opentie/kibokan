const StringValidator = require('./string_validator');

class MinlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length >= this.threshold);
  }
}
MinlengthValidator.property('threshold', 0);

module.exports = MinlengthValidator;
