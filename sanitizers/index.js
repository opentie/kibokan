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

class StringSanitizer extends BaseSanitizer {
  get zeroValue() {
    return '';
  }

  check(input) {
    return typeof input === 'string';
  }
}

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

module.exports = {
  BaseSanitizer,
  StringSanitizer,
  ListSanitizer,
  OptionSanitizer,
};
