'use strict';

let assert = require('assert');
if (process.env.NODE_ENV === 'test') {
  assert = require('power-assert'); // eslint-disable-line global-require
}

const {
  AbstractSchema,
  NumberSchema,
  NullSchema,
} = require('../lowlevel');

class BaseValidator {
  constructor(parameter) {
    // this is an abstract class
    if (this.constructor === BaseValidator) {
      throw new TypeError('Illigal constructor');
    }
    assert(this.constructor.parameterSchema instanceof AbstractSchema);

    this.option = this.constructor.parameterSchema.normalize(parameter);
  }
}

class MaxlengthValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (typeof input === 'string' && input.length <= this.option);
  }
}

class MinlengthValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (typeof input === 'string' && input.length >= this.option);
  }
}

class MaxvalueValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (typeof input === 'string' &&
            !Number.isNaN(Number(input)) &&
            Number(input) <= this.option);
  }
}

class MinvalueValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (typeof input === 'string' &&
            !Number.isNaN(Number(input)) &&
            Number(input) >= this.option);
  }
}

class NumberValidator extends BaseValidator {
}

module.exports = {
  BaseValidator,
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
};
