const Serializable = require('../serializable');

class BaseValidator extends Serializable {
  validate(input) {
    return true;
  }
}

module.exports = BaseValidator;
