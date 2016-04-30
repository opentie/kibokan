'use strict';

const BaseOperator = require('./base_operator');
const MatchOperator = require('./base_operator');

const { arrayOf, polymorphic, instanceOf } = require('../mappers');

class AndOperator extends BaseOperator {
  mongoize() {
    return {
      $and: this.operators.map(op => op.mongoize())
    };
  }
}
AndOperator.property('operators', arrayOf(instanceOf(MatchOperator)));

module.exports = AndOperator;
