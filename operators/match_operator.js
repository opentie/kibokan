'use strict';

const ValueOperators = require('./value_operators');
const BaseOperator = require('./base_operator');

const { polymorphic, instanceOf, identical } = require('../mappers');

class MatchOperator extends BaseOperator {
  mongoize() {
    return {
      [`${this.form}.${this.field}`]: this.value.mongoize()
    };
  }
}
MatchOperator.property('form', identical);
MatchOperator.property('field', identical);
MatchOperator.property('value', polymorphic(instanceOf, ValueOperators));

module.exports = MatchOperator;
