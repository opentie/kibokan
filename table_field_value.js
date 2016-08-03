'use strict';

const NamedObjectMap = require('./named_object_map');

const FormValue = require('./form_value');
const FieldValue = require('./field_value');
const RowValue = require('./row_value');

class TableFieldValue extends FieldValue {
  constructor(field, value) {
    super(field, value);

    this.isValid = this.isValid &&
      this.rowValues.map((rowValue) => rowValue.isValid);

    if (this.constructor === FieldValue) {
      Object.freeze(this);
    }
  }

  get name() {
    return this.field.name;
  }

  set value(sanitizedRawValue) {
    this.rowValues = sanitizedRawValue.map((rawRowValue) => {
      return new RowValue(this.field, rawRowValue);
    });
  }

  get value() {
    return this.rowValues.map((rowValue) => rowValue.value);
  }
}

module.exports = TableFieldValue;

