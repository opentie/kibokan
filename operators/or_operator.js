'use strict';

const BaseOperator = require('./base_operator');
const AndOperator = require('./and_operator');

const { arrayOf, instanceOf } = require('../mappers');

class OrOperator extends BaseOperator {
  mongoize() {
    if (this.operators.length === 0) {
      return {};
    }

    return {
      $and: this.operators.map(op => op.mongoize())
    };
  }
}
OrOperator.property('operators', arrayOf(instanceOf(AndOperator)));

module.exports = OrOperator;
