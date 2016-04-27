'use strict';

const BaseSanitizer = require('./base_sanitizer');

class ListSanitizer extends BaseSanitizer {
  get zeroValue() {
    return [];
  }

  isZero(input) {
    return this.sanitize(input).length === 0;
  }

  check(input) {
    return Array.isArray(input);
  }
}

module.exports = ListSanitizer;
