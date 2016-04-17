'use strict';

const assert = require('assert');

const {
  AbstractSchema,
  NumberSchema,
  NullSchema,
} = require('../lowlevel');

const {
  StringSanitizer,
  ListSanitizer,
} = require('../sanitizers');

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
  static get sanitizer() {
    return StringSanitizer;
  }
}

class MaxlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length <= this.parameter);
  }
}
MaxlengthValidator.parameterSchema = new NumberSchema();

class MinlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length >= this.parameter);
  }
}
MinlengthValidator.parameterSchema = new NumberSchema();

class NumericValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) &&
            !Number.isNaN(Number(input)));
  }
}
NumericValidator.parameterSchema = new NullSchema();

class MaxvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) <= this.parameter);
  }
}
MaxvalueValidator.parameterSchema = new NumberSchema();

class MinvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.parameter);
  }
}
MinvalueValidator.parameterSchema = new NumberSchema();

class ListValidator extends BaseValidator {
  static get sanitizer() {
    return ListSanitizer;
  }
}

class MaxitemsValidator extends ListValidator {
  validate(input) {
    return input.length <= this.parameter;
  }
}
MaxitemsValidator.parameterSchema = new NumberSchema();

class MinitemsValidator extends ListValidator {
  validate(input) {
    return input.length >= this.parameter;
  }
}
MinitemsValidator.parameterSchema = new NumberSchema();

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
