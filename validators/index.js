'use strict';

const assert = require('assert');

const {
  AbstractSchema,
  NumberSchema,
  NullSchema,
} = require('../lowlevel');

class BaseValidator {
  constructor(parameter = null) {
    // this is an abstract class
    if (this.constructor === BaseValidator) {
      throw new TypeError('Illigal constructor');
    }
    assert(this.constructor.parameterSchema instanceof AbstractSchema);

    this.parameter = this.constructor.parameterSchema.normalize(parameter);
  }

  validate(input) {
    return true;
  }
}

class StringValidator extends BaseValidator {
  static get parameterSchema() {
    return new NullSchema();
  }

  validate(input) {
    return typeof input === 'string';
  }
}

class MaxlengthValidator extends StringValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) && input.length <= this.parameter);
  }
}

class MinlengthValidator extends StringValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) && input.length >= this.parameter);
  }
}

class NumericValidator extends StringValidator {
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
            Number(input) <= this.parameter);
  }
}

class MinvalueValidator extends NumericValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.parameter);
  }
}

class ListValidator extends BaseValidator {
  static get parameterSchema() {
    return new NullSchema();
  }

  validate(input) {
    return Array.isArray(input);
  }
}

class MaxitemsValidator extends ListValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return input.length <= this.parameter;
  }
}

class MinitemsValidator extends ListValidator {
  static get parameterSchema() {
    return new NumberSchema();
  }

  validate(input) {
    return input.length >= this.parameter;
  }
}

module.exports = {
  BaseValidator,
  StringValidator,
  MaxlengthValidator,
  MinlengthValidator,
  NumericValidator,
  MaxvalueValidator,
  MinvalueValidator,
  ListValidator,
  MaxitemsValidator,
  MinitemsValidator,
};
