const ListValidator = require('./list_validator');

class MinitemsValidator extends ListValidator {
  validate(input) {
    return input.length >= this.threshold;
  }
}
MinitemsValidator.property('threshold', 0);

module.exports = MinitemsValidator;
