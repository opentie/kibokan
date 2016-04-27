'use strict';

const { ListSanitizer } = require('../sanitizers');

const BaseValidator = require('./base_validator');

class ListValidator extends BaseValidator {
  static get sanitizer() {
    return ListSanitizer;
  }
}

module.exports = ListValidator;
