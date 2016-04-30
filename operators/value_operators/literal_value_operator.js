'use strict';

const BaseValueOperator = require('./base_value_operator');

const { identical } = require('../../mappers');

class LiteralValueOperator extends BaseValueOperator {
  mongoize() {
    return this.value;
  }
}
LiteralValueOperator.property('value', identical);

module.exports = LiteralValueOperator;
