'use strict';

const NamedObjectMap = require('./named_object_map');

const FieldValue = require('./field_value');

class FormValue {
  constructor(form, value) {
    this.form = form;

    this.fieldValues = new NamedObjectMap();
    for (const field of this.form.fields) {
      this.constructFieldValues(value, field);
    }
    this.isValid = [...this.fieldValues.values()].
      every(fieldValue => fieldValue.isValid);

    Object.freeze(this);
  }

  constructFieldValues(rawValue, field) {
    const fieldValue = new FieldValue(field, rawValue[field.name]);
    this.fieldValues.add(fieldValue);

    fieldValue.insertionFields.map((insertionField) => {
      return this.constructFieldValues(rawValue, insertionField);
    });
  }

  get name() {
    return this.form.name;
  }

  get value() {
    const value = {};
    for (const fieldValue of this.fieldValues.values()) {
      value[fieldValue.name] = fieldValue.value;
    }

    return value;
  }
}

module.exports = FormValue;