/* eslint-env mocha */

'use strict';

const assert = require('power-assert');

const {
  TextFieldType,
  ParagraphFieldType,
  RadioFieldType,
} = require('../field_types');

const {
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
} = require('../validators');

describe('TextFieldType', () => {
  describe('#validate', () => {
    context('when maxlength = 10', () => {
      const type = new TextFieldType([
        new MaxlengthValidator(10),
      ]);

      it('should return 1 error to "hello world"', () => {
        const errors = type.validate('hello world');
        assert(errors.length === 1);
        assert(errors[0] instanceof MaxlengthValidator);
      });
    });

    context('when maxlength = 20', () => {
      const type = new TextFieldType([
        new MaxlengthValidator(20),
      ]);

      it('should return no errors to "hello world"', () => {
        const errors = type.validate('hello world');
        assert(errors.length === 0);
      });
    });

    context('when maxlength = 20, minlength = 10', () => {
      const type = new TextFieldType([
        new MaxlengthValidator(20),
        new MinlengthValidator(10),
      ]);

      it('should return no errors to "hello world"', () => {
        const errors = type.validate('hello world');
        assert(errors.length === 0);
      });
    });
  });
});
