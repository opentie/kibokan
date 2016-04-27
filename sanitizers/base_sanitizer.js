'use strict';

class BaseSanitizer {
  get zeroValue() {
    throw new Error('Not implemented');
  }

  isZero(input) {
    return this.zeroValue === this.sanitize(input);
  }

  check(input) {
    return true;
  }

  sanitize(input) {
    if (this.check(input)) {
      return input;
    }

    return this.zeroValue;
  }
}

module.exports = BaseSanitizer;
