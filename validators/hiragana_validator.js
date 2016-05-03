'use strict';

const { identical } = require('../mappers');

const StringValidator = require('./string_validator');

class HiraganaValidator extends StringValidator {
  validate(input) {
    return (super.validate(input) && /^[一-〜\u3040-\u309F]+$/.test(input));
  }
}

module.exports = HiraganaValidator;
