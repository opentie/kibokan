'use strict';

const BaseValueOperator = require('./base_value_operator');

class ExistsValueOperator extends BaseValueOperator {
  mongoize() {
    return { $exists: true };
  }
}

module.exports = ExistsValueOperator;
