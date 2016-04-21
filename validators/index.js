'use strict';

const assert = require('assert');

const {
  StringSanitizer,
  ListSanitizer,
} = require('../sanitizers');

const NamedObjectMap = require('../named_object_map');

const Validators = new NamedObjectMap();

class BaseValidator {
  constructor(category, parameter = null) {
    this.category = category;
    this.parameter = parameter;
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
Validators.add(MaxlengthValidator);

class MinlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length >= this.parameter);
  }
}
Validators.add(MinlengthValidator);

class NumericValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) &&
            !Number.isNaN(Number(input)));
  }
}
Validators.add(NumericValidator);

class MaxvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) <= this.parameter);
  }
}
Validators.add(MaxvalueValidator);

class MinvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.parameter);
  }
}
Validators.add(MinvalueValidator);

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
Validators.add(MaxitemsValidator);

class MinitemsValidator extends ListValidator {
  validate(input) {
    return input.length >= this.parameter;
  }
}
Validators.add(MinitemsValidator);

module.exports = Object.assign(Validators, {
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
});
