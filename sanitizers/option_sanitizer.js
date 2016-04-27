'use strict';

const BaseSanitizer = require('./base_sanitizer');

class OptionSanitizer extends BaseSanitizer {
  constructor(options) {
    super();

    this.options = options;
  }

  get zeroValue() {
    return null;
  }

  isZero(input) {
    return this.sanitize(input) === null;
  }

  check(input) {
    return this.options.indexOf(input) !== -1;
  }
}

module.exports = OptionSanitizer;
