'use strict';

const assert = require('assert');

const NamedObjectMap = require('../named_object_map');

const { arrayOf, identical, polymorphic, instanceOf } = require('../mappers');

const Validators = require('../validators');

const Fields = require('./index');
const BaseField = require('./base_field');

const TableFieldValue = require('../table_field_value');

const { TableSanitizer } = require('../sanitizers');

class TableField extends BaseField {
  get sanitizer() {
    return new TableSanitizer(this.columns.map((column) => column.name));
  }

  set columns(fields) {
    this.columnsMap = NamedObjectMap.fromArray(fields);
  }

  get columns() {
    return [...this.columnsMap.values()];
  }

  constructValue(rawValue) {
    return new TableFieldValue(this, rawValue);
  }
}
TableField.property('columns', arrayOf(polymorphic(instanceOf, Fields)));

module.exports = TableField;
