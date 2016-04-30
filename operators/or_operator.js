'use strict';

const Operators = require('./index');
const BaseOperator = require('./base_operator');

const { arrayOf, instanceOf } = require('../mappers');

class OrOperator extends BaseOperator {
  mongoize() {
    return {
      $and: this.operators.map(op => op.mongoize())
    };
  }
}
OrOperator.property('operators', arrayOf(instanceOf(Operators)));

module.exports = OrOperator;
