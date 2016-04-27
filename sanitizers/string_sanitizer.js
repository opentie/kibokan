'use strict';

const BaseSanitizer = require('./base_sanitizer');

class StringSanitizer extends BaseSanitizer {
  get zeroValue() {
    return '';
  }

  check(input) {
    return typeof input === 'string';
  }
}

module.exports = StringSanitizer;
