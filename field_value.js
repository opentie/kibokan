'use strict';

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

class FieldValue extends Serializable {
}
FieldValue.property('name', '');
FieldValue.property('value', null);

module.exports = FieldValue;
