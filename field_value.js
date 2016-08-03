'use strict';

function id(value) {
  return value;
}

class FieldValue {
  constructor(field, value) {
    this.field = field;

    const { sanitizer, validators } = this.field;
    this.value = sanitizer.sanitize(value);
    this.isMissing = this.field.isRequired && sanitizer.isZero(this.value);
    this.validities = validators.map(validator => {
      return {
        validator,
        validity: validator.validate(this.value),
      };
    });
    this.insertionFields = this.field.retrieveInsertionFields(this.value);
    this.isValid = !this.isMissing &&
      this.validities.every(({validity}) => validity);

    if (this.constructor === FieldValue) {
      Object.freeze(this);
    }
  }

  get name() {
    return this.field.name;
  }
}

module.exports = FieldValue;
