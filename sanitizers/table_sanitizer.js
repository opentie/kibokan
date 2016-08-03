'use strict';

const ListSanitizer = require('./list_sanitizer');

class TableSanitizer extends ListSanitizer {
  constructor(columns = []) {
    super();

    this.columns = columns;
  }

  isValidRow(row) {
    return typeof row === 'object' &&
      this.columns.every((column) => {
        return Object.hasOwnProperty.call(row, column);
      });
  }

  check(input) {
    return super.check(input) && input.every(this.isValidRow.bind(this));
  }

  sanitize(input) {
    if (!(super.check(input))) {
      return this.zeroValue;
    }

    return input.filter(this.isValidRow.bind(this));
  }
}

module.exports = TableSanitizer;
