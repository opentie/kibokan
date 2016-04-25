'use strict';

const Serializable = require('./serializable');
const NamedObjectMap = require('./named_object_map');

const FormValue = require('./form_value');

class Entity extends Serializable {
  constructor(category) {
    this.category = category;
  }

  set formValues(formValues) {
    this._formValues = NamedObjectMap.fromArray(formValues);
  }

  get fromValues() {
    return [...this._formValues.values()];
  }
}
Entity.property('formValues', [], [FormValue]);

module.exports = Entity;
