'use strict';

const BaseOperator = require('./base_operator');
const MatchOperator = require('./match_operator');

const { arrayOf, instanceOf } = require('../mappers');

class AndOperator extends BaseOperator {
  mongoize() {
    if (this.operators.length === 0) {
      return {};
    }

    return {
      $and: this.operators.map(op => op.mongoize())
    };
  }
}

AndOperator.property('operators', arrayOf(instanceOf(MatchOperator)));

module.exports = AndOperator;
