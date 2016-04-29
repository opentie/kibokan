'use strict';

const { identical } = require('../mappers');

const ListValidator = require('./list_validator');

class MinitemsValidator extends ListValidator {
  validate(input) {
    return input.length >= this.threshold;
  }
}
MinitemsValidator.property('threshold', identical);

module.exports = MinitemsValidator;
