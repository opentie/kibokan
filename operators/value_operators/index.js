'use strict';

const NamedObjectMap = require('../../named_object_map');

const ValueOperators = new NamedObjectMap();

module.exports = ValueOperators;

const BaseValueOperator = require('./base_value_operator');
const LiteralValueOperator = require('./literal_value_operator');

ValueOperators.add(LiteralValueOperator);

Object.assign(ValueOperators, {
  BaseValueOperator,

  LiteralValueOperator,
});
