'use strict';

const { identical } = require('../mappers');

const ListValidator = require('./list_validator');

class MaxitemsValidator extends ListValidator {
  validate(input) {
    return input.length <= this.threshold;
  }
}
MaxitemsValidator.property('threshold', identical);

module.exports = MaxitemsValidator;
