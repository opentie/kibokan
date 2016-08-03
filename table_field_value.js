'use strict';

const NamedObjectMap = require('./named_object_map');

const FormValue = require('./form_value');
const FieldValue = require('./field_value');

class RowValue {
  constructor(table, value) {
    this.table = table;

    this.value = value;

    this.isValid = [...this.columnValues.values()].
      every(columnValue => columnValue.isValid);
  }

  set value(rawValue) {
    this.columnValues = new NamedObjectMap();

    for (const column of this.table.columns) {
      const columnValue = column.constructValue(rawValue[column.name]);
      this.columnValues.add(columnValue);
    }
  }

  get value() {
    const value = {};
    for (const columnValue of this.columnValues.values()) {
      value[columnValue.name] = columnValue.value;
    }

    return value;
  }
}

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

