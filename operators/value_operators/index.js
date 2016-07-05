'use strict';

const NamedObjectMap = require('../../named_object_map');

const ValueOperators = new NamedObjectMap();

module.exports = ValueOperators;

const BaseValueOperator = require('./base_value_operator');
const LiteralValueOperator = require('./literal_value_operator');
const ExistsValueOperator = require('./exists_value_operator');

ValueOperators.add(LiteralValueOperator);
ValueOperators.add(ExistsValueOperator);

Object.assign(ValueOperators, {
  BaseValueOperator,

  LiteralValueOperator,
  ExistsValueOperator,
});
