'use strict';

const NamedObjectMap = require('./named_object_map');

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

module.exports = RowValue;
