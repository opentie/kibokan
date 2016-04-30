/* eslint-env mocha */

'use strict';

const assert = require('assert');

const {
  MaxlengthValidator,
  MinlengthValidator,
  MaxvalueValidator,
  MinvalueValidator,
  MaxitemsValidator,
  MinitemsValidator,
} = require('../validators');

describe('MaxlengthValidator', () => {
  context('when parameter = 10', () => {
    const validator = new MaxlengthValidator(null);
    validator.threshold = 10;

    it('should return true to "goodbye"', () => {
      assert(validator.validate('goodbye') === true);
    });

    it('should return false to "hello world"', () => {
      assert(validator.validate('hello world') === false);
    });

    it('should serialize itself', () => {
      assert.deepEqual(validator.serialize(), {
        _version: 0,
        threshold: 10,
      });
    });
  });
});

describe('MinlengthValidator', () => {
  context('when parameter = 11', () => {
    const validator = new MinlengthValidator(null);
    validator.threshold = 11;

    it('should return false to "goodbye"', () => {
      assert(validator.validate('goodbye') === false);
    });

    it('should return false to "hello world"', () => {
      assert(validator.validate('hello world') === true);
    });
  });
});

describe('MaxvalueValidator', () => {
  context('always', () => {
    const validator = new MaxvalueValidator(null);
    validator.threshold = 100;

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });
  });

  context('when parameter = 3', () => {
    const validator = new MaxvalueValidator(null);
    validator.threshold = 3;

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });

    it('should return false to "4"', () => {
      assert(validator.validate('4') === false);
    });

    it('should return true to "3"', () => {
      assert(validator.validate('3') === true);
    });
  });
});

describe('MinvalueValidator', () => {
  context('always', () => {
    const validator = new MinvalueValidator(null);
    validator.threshold = 10;

    it('should return false to a non-numeric string', () => {
      assert(validator.validate('non numeric string') === false);
    });
  });

  context('when parameter = 3', () => {
    const validator = new MinvalueValidator(null);
    validator.threshold = 3;

    it('should return false to "2"', () => {
      assert(validator.validate('2') === false);
    });

    it('should return true to "3"', () => {
      assert(validator.validate('3') === true);
    });
  });
});

describe('MaxitemsValidator', () => {
  const validator = new MaxitemsValidator(null);
  validator.threshold = 2;

  it('should return false to [1, 2, 3]', () => {
    assert(validator.validate([1, 2, 3]) === false);
  });

  it('should return true to [1, 2]', () => {
    assert(validator.validate([1, 2]) === true);
  });
});

describe('MinitemsValidator', () => {
  const validator = new MinitemsValidator(null);
  validator.threshold = 2;

  it('should return false to [1]', () => {
    assert(validator.validate([1]) === false);
  });

  it('should return true to [1, 2]', () => {
    assert(validator.validate([1, 2]) === true);
  });
});
