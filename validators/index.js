'use strict';

const assert = require('assert');

const Serializable = require('../serializable');

const {
  StringSanitizer,
  ListSanitizer,
} = require('../sanitizers');

const NamedObjectMap = require('../named_object_map');

const Validators = new NamedObjectMap();

class BaseValidator extends Serializable {
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
    return (super.validate(input) && input.length <= this.threshold);
  }
}
MaxlengthValidator.property('threshold', 0);
Validators.add(MaxlengthValidator);

class MinlengthValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && input.length >= this.threshold);
  }
}
MinlengthValidator.property('threshold', 0);
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
            Number(input) <= this.threshold);
  }
}
MaxvalueValidator.property('threshold', 0);
Validators.add(MaxvalueValidator);

class MinvalueValidator extends NumericValidator {
  validate(input) {
    return (super.validate(input) &&
            Number(input) >= this.threshold);
  }
}
MinvalueValidator.property('threshold', 0);
Validators.add(MinvalueValidator);

class ListValidator extends BaseValidator {
  static get sanitizer() {
    return ListSanitizer;
  }
}

class MaxitemsValidator extends ListValidator {
  validate(input) {
    return input.length <= this.threshold;
  }
}
MaxitemsValidator.property('threshold', 0);
Validators.add(MaxitemsValidator);

class MinitemsValidator extends ListValidator {
  validate(input) {
    return input.length >= this.threshold;
  }
}
MinitemsValidator.property('threshold', 0);
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
