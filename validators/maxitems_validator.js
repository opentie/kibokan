const ListValidator = require('./list_validator');

class MaxitemsValidator extends ListValidator {
  validate(input) {
    return input.length <= this.threshold;
  }
}
MaxitemsValidator.property('threshold', 0);

module.exports = MaxitemsValidator;
