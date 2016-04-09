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

  validate(input) {
    return typeof input === 'string';
  }
}

class MaxlengthValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) && input.length <= this.option);
  }
}

class MinlengthValidator extends BaseValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) && input.length >= this.option);
  }
}

class NumericValidator extends BaseValidator{
  static get parameterSchema() {
    return new NullSchema();
  }

  validate(input) {
    return (super.validate(input) &&
            !Number.isNaN(Number(input)));
  }
}

class MaxvalueValidator extends NumericValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) &&
            Number(input) <= this.option);
  }
}

class MinvalueValidator extends NumericValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.option);
  }
}

module.exports = {
  BaseValidator,
  MaxlengthValidator,
  MinlengthValidator,
  NumericValidator,
  MaxvalueValidator,
  MinvalueValidator,
};
