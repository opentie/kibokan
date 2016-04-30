'use strict';

const NamedObjectMap = require('./named_object_map');

const Operators = new NamedObjectMap();

module.exports = Operators;

const BaseOperator = require('./base_operator');
const AndOperator = require('./and_operator');
const OrOperator = require('./or_operator');
const MatchOperator = require('./match_operator');

Operators.add(AndOperator);
Operators.add(OrOperator);
Operators.add(MatchOperator);

const ValueOperators = require('./value_operators');

Object.assign(Operators, {
  BaseOperator,

  AndOperator,
  OrOperator,
  MatchOperator,

  ValueOperators,
});
