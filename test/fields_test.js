/* eslint-env mocha */

'use strict';

const assert = require('power-assert');

const Category = require('../category');

const {
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
} = require('../validators');

const category = new Category('test category');

describe('TextFieldType', () => {
  describe('#validate', () => {
    context('when maxlength = 10', () => {
      const field = category.createField('TextField', {
        validators: [
          category.createValidator('MaxlengthValidator', 10)
        ]
      });

      it('should return 1 error to "hello world"', () => {
        const errors = field.validate('hello world');
        assert(errors.length === 1);
        assert(errors[0] instanceof MaxlengthValidator);
      });
    });

    context('when maxlength = 20', () => {
      const field = category.createField('TextField', {
        validators: [
          category.createValidator('MaxlengthValidator', 20)
        ]
      });

      it('should return no errors to "hello world"', () => {
        const errors = field.validate('hello world');
        assert(errors.length === 0);
      });
    });

    context('when maxlength = 20, minlength = 10', () => {
      const field = category.createField('TextField', {
        validators: [
          category.createValidator('MaxlengthValidator', 20),
          category.createValidator('MinlengthValidator', 10),
        ]
      });

      it('should return no errors to "hello world"', () => {
        const errors = field.validate('hello world');
        assert(errors.length === 0);
      });
    });
  });
});
