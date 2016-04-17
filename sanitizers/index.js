'use strict';

class BaseSanitizer {
  constructor(input) {
    this.input = input;
  }

  get zeroValue() {
    throw new Error('Not implemented');
  }

  get isZero() {
    return this.zeroValue === this.sanitize();
  }

  check() {
    return true;
  }

  sanitize() {
    if (this.check()) {
      return this.input;
    }

    return this.zeroValue;
  }
}

class StringSanitizer extends BaseSanitizer {
  get zeroValue() {
    return '';
  }

  check() {
    return typeof this.input === 'string';
  }
}

class ListSanitizer extends BaseSanitizer {
  get zeroValue() {
    return [];
  }

  get isZero() {
    return this.sanitize().length === 0;
  }

  check() {
    return Array.isArray(this.input);
  }
}

module.exports = {
  BaseSanitizer,
  StringSanitizer,
  ListSanitizer,
};
