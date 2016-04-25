'use strict';

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

const FieldValue = require('./field_value');

class FormValue extends Serializable {
  constructor(category) {
    this.category = category;
  }

  get form() {
    return this.category.resolve(this.name);
  }
}
FormValue.property('name', '');
FormValue.property('fieldValues', [], [FieldValue]);

module.exports = FormValue;
